import { Router, Request, Response } from 'express';
import { createTrade, deleteTrade, findTrade, getTrades, updateTrade } from '../models/trade';
import { checkLogin } from '../middleware';
import { findUser } from '../models/user';
import { createTradeItem, deleteTradeItem, updateTradeItem } from '../models/trade_item';
import { findItem, findItemsByTradeID } from '../models/item';

const tradeRouter = Router();
tradeRouter.use(checkLogin);

tradeRouter.post('/', async (req: Request, res: Response) => {
    const { user_id, items } = req.body;

    // Validate request body
    if (!user_id || !items) {
        res.status(400).json({
            message: "User ID and status are required"
        });
        return;
    }
    else if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({
            message: "Items must be a non-empty array"
        });
        return;
    }

    let itemIds: number[] = [];
    for (const item of items) {
        if (!item.id || !item.quantity) {
            res.status(400).json({
                message: "Each item must have an ID and quantity"
            });
            return;
        }
        if (itemIds.includes(item.id)) {
            res.status(400).json({
                message: "Duplicate item IDs are not allowed"
            });
            return;
        }
        if (item.quantity <= 0) {
            res.status(400).json({
                message: "Item quantity must be greater than 0"
            });
            return;
        }

        itemIds.push(item.id);
    }

    try {
        if (!await findUser({ id: user_id })) {
            res.status(400).json({
                message: "User with this ID does not exist"
            });
            return;
        }

        const trade = await createTrade({
            user_id,
            status: 'pending',
        });

        for (const data of items) {
            const item = await findItem({ id: data.id });
            if (!item) {
                res.status(400).json({
                    message: "Item with this ID does not exist"
                });
                return;
            }

            await createTradeItem({
                trade_id: Number(trade.insertId),
                item_id: data.id,
                quantity: data.quantity
            });
        }

        res.status(201).json({
            message: "Trade created successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating trade"
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

export default tradeRouter;
