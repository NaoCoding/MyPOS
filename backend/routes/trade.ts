import { Router, Request, Response } from 'express';
import { createTrade, deleteTrade, findTrade, getTrades, updateTrade } from '../models/trade';
import { checkLogin } from '../middleware';
import { findUser } from '../models/user';
import { createTradeItem, deleteTradeItem, updateTradeItem } from '../models/trade_item';
import { findItem, findItemsByTradeID } from '../models/item';
import { findCustomizationGroupByItemID } from '../models/customization_group';
import { findCustomization, findCustomizationsByGroupID } from '../models/customization';
import { createTradeItemCustomization, findTradeItemCustomizationsByTradeItemId } from '../models/trade_item_customization';

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
        const rawTrades = await getTrades();
        let trades = [];

        for (const rawTrade of rawTrades) {
            const tradeItems = await getTradeItemsWithCustomizations(rawTrade.id);
            trades.push({
                ...rawTrade,
                trade_items: tradeItems
            });
        }

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

        const tradeItems = await getTradeItemsWithCustomizations(Number(id));

        res.status(200).json({
            ...trade,
            trade_items: tradeItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching trade"
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
        if (!customizationGroup.id) {
            continue;
        }

        const customizations = await findCustomizationsByGroupID(customizationGroup.id);
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

async function getTradeItemsWithCustomizations(tradeId: number) {
    const tradeItems = await findItemsByTradeID(tradeId);
    const itemsWithCustomizations = [];

    for (const tradeItem of tradeItems) {
        if (!tradeItem.id) {
            continue;
        }

        const item = await findItem({ id: tradeItem.item_id });
        const tradeItemCustomizations = await findTradeItemCustomizationsByTradeItemId(tradeItem.id);
        let customizations = [];

        if (tradeItemCustomizations && tradeItemCustomizations.length > 0) {
            for (const tradeItemCustomization of tradeItemCustomizations) {
                const customization = await findCustomization({ id: tradeItemCustomization.customization_id });

                if (customization) {
                    customizations.push({
                        id: customization.id,
                        name: customization.name,
                        price_delta_snapshot: tradeItemCustomization.price_delta_snapshot
                    });
                }
            }
        }

        if (item?.quantity && tradeItem.quantity) {
            item.quantity = tradeItem.quantity;
        }

        itemsWithCustomizations.push({
            ...item,
            customizations
        });
    }

    return itemsWithCustomizations;
}

export default tradeRouter;
