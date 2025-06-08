import { Router, Request, Response } from 'express';
import { createTrade, findTrade, findUserTrades, getTrades, updateTrade } from '../models/trade';
import { checkLogin } from '../middleware';
import { findUser } from '../models/user';
import { get } from 'http';

const tradeRouter = Router();
tradeRouter.use(checkLogin);

tradeRouter.post('/', async (req: Request, res: Response) => {
    const { user_id } = req.body;

    // Validate request body
    if (!user_id) {
        res.status(400).json({
            message: "User ID and status are required"
        });
        return;
    }

    try {
        if (!await findUser({ id: user_id })) {
            res.status(400).json({
                message: "User with this ID does not exist"
            });
            return;
        }

        await createTrade({
            user_id,
            status: 'pending',
        });

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
        res.status(200).json(trade);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching trade"
        });
    }
});

tradeRouter.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, status } = req.body;

    // Validate request body
    if (!user_id || !status) {
        res.status(400).json({
            message: "User ID and status are required"
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

        res.status(200).json({
            message: "Trade updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating trade"
        });
    }
});

export default tradeRouter;
