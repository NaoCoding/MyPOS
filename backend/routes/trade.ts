import { Router, Request, Response } from 'express';
import { createTrade, deleteTrade, findTrade, getTrades, updateTrade } from '../models/trade';
import { checkLogin } from '../middleware';
import { findUser } from '../models/user';
import { createTradeItem, deleteTradeItem, updateTradeItem } from '../models/trade_item';
import { findItem, findItemsByTradeID } from '../models/item';
import { findCustomizationGroupByItemID } from '../models/customization_group';
import { findCustomization, findCustomizationsByGroupID } from '../models/customization';
import { createTradeItemCustomization } from '../models/trade_item_customization';

const tradeRouter = Router();
tradeRouter.use(checkLogin);

tradeRouter.post('/', async (req: Request, res: Response) => {
    const { user_id, trade_items } = req.body;

    // Validate request body
    if (!user_id || !trade_items) {
        res.status(400).json({
            message: "User ID and status are required"
        });
        return;
    }
    else if (!Array.isArray(trade_items) || trade_items.length === 0) {
        res.status(400).json({
            message: "Items must be a non-empty array"
        });
        return;
    }

    for (const trade_item of trade_items) {
        if (!trade_item.id || !trade_item.quantity) {
            res.status(400).json({
                message: "Each item must have an ID and quantity"
            });
            return;
        }
        if (trade_item.quantity <= 0) {
            res.status(400).json({
                message: "Item quantity must be greater than 0"
            });
            return;
        }
    }

    try {
        if (!await findUser({ id: user_id })) {
            res.status(400).json({
                message: "User with this ID does not exist"
            });
            return;
        }

        for (const trade_item of trade_items) {
            const item = await findItem({ id: trade_item.id });
            if (!item) {
                res.status(400).json({
                    message: "Item with this ID does not exist"
                });
                return;
            }

            await checkCustomizations(trade_item.id, trade_item.customizations || []);
        }

        const trade = await createTrade({
            user_id,
            status: 'pending'
        });

        for (const trade_item of trade_items) {
            const newTradeItem = await createTradeItem({
                trade_id: Number(trade.insertId),
                item_id: trade_item.id,
                quantity: trade_item.quantity
            });
            const tradeItemId = Number(newTradeItem.insertId);

            if (!trade_item.customizations || trade_item.customizations.length === 0) {
                continue;
            }

            for (const customizationId of trade_item.customizations) {
                const customization = await findCustomization({ id: customizationId });

                if (!customization) {
                    res.status(400).json({
                        message: `Customization with ID ${customizationId} does not exist`
                    });
                    return;
                }

                await createTradeItemCustomization({
                    trade_item_id: tradeItemId,
                    customization_id: customization.id,
                    price_delta_snapshot: customization.price_delta
                });
            }
        }

        res.status(201).json({
            message: "Trade created successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating trade",
            error
        });
    }
});

tradeRouter.get('/', async (req: Request, res: Response) => {
    try {
        const trades = await getTrades();
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching trades"
        });
    }
});

tradeRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const trade = await findTrade({ id: Number(id) });
        if (!trade) {
            res.status(404).json({
                message: "Trade not found"
            });
            return;
        }

        const tradeItems = await findItemsByTradeID(Number(id));

        res.status(200).json({
            ...trade,
            items: tradeItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching trade"
        });
    }
});

tradeRouter.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, status, items } = req.body;

    // Validate request body
    if (!user_id || !status || !items) {
        res.status(400).json({
            message: "User ID, status, and items are required"
        });
        return;
    }
    else if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({
            message: "Items must be a non-empty array"
        });
        return;
    }
    else if (status !== 'pending' && status !== 'completed') {
        res.status(400).json({
            message: "Status must be either 'pending' or 'completed'"
        });
        return;
    }

    try {
        if (!await findTrade({ id: Number(id) })) {
            res.status(404).json({
                message: "Trade not found"
            });
            return;
        }

        if (!await findUser({ id: user_id })) {
            res.status(400).json({
                message: "User with this ID does not exist"
            });
            return;
        }

        await updateTrade({
            id: Number(id),
            user_id,
            status,
        });

        // Update trade items
        const existingTradeItems = await findItemsByTradeID(Number(id));
        const existingItemIds = existingTradeItems.map(item => item.id);

        for (const tradeItem of existingTradeItems) {
            // Remove items that are no longer associated
            const existingItem = items.find(i => i.id === tradeItem.item_id);
            if (!existingItem) {
                await deleteTradeItem({ id: Number(tradeItem.id) });
                continue;
            }

            // Update existing items
            if (existingItem.quantity !== tradeItem.quantity) {
                await updateTradeItem({
                    id: Number(tradeItem.id),
                    quantity: existingItem.quantity
                });
            }
        }

        // Add new items
        for (const item of items) {
            if (!existingItemIds.includes(item.id)) {
                await createTradeItem({
                    trade_id: Number(id),
                    item_id: item.id,
                    quantity: item.quantity
                });
            }
        }

        res.status(200).json({
            message: "Trade updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating trade"
        });
    }
});

tradeRouter.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const trade = await findTrade({ id: Number(id) });
        if (!trade) {
            res.status(404).json({
                message: "Trade not found"
            });
            return;
        }

        await deleteTrade({ id: Number(id) });
        res.status(200).json({
            message: "Trade deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting trade"
        });
    }
});

async function checkCustomizations(itemId: number, itemCustomizationIds: any[]): Promise<boolean> {
    if (!Array.isArray(itemCustomizationIds) || itemCustomizationIds.length === 0) {
        return true;
    }

    const customizationGroups = await findCustomizationGroupByItemID(itemId);
    if (!customizationGroups || customizationGroups.length === 0) {
        if (itemCustomizationIds.length > 0) {
            console.error("Item does not support customizations");
            throw new Error("Item does not support customizations");
        }

        return true;
    }

    for (const customizationId of itemCustomizationIds) {
        const customization = await findCustomization({ id: customizationId });
        if (!customization) {
            console.error(`Customization with ID ${customizationId} does not exist.`);
            throw new Error(`Customization with ID ${customizationId} does not exist.`);
        }
    }

    let validCustomizationCount = 0;

    for (const customizationGroup of customizationGroups) {
        if (!customizationGroup.customization_group_id) {
            continue;
        }

        const customizations = await findCustomizationsByGroupID(customizationGroup.customization_group_id);
        const customizationIds = customizations.map(c => c.id);

        console.log(`Checking customizations for group ${customizationGroup.name}:`, customizationIds);

        let min = customizationGroup.is_required ? 1 : 0;
        let max = customizationGroup.is_multiple_choice ? customizations.length : 1;

        const selectedCustomizations = itemCustomizationIds.filter(id => customizationIds.includes(id));

        if (selectedCustomizations.length < min || selectedCustomizations.length > max) {
            console.error(`Invalid number of customizations for group ${customizationGroup.name}. Expected between ${min} and ${max}, but got ${selectedCustomizations.length}.`);
            throw new Error(`Invalid number of customizations for group ${customizationGroup.name}. Expected between ${min} and ${max}, but got ${selectedCustomizations.length}.`);
        }

        validCustomizationCount += selectedCustomizations.length;
    }

    if (validCustomizationCount !== itemCustomizationIds.length) {
        console.error("Some customizations are not valid for the selected item.");
        throw new Error("Some customizations are not valid for the selected item.");
    }

    return true;
}

export default tradeRouter;
