import { Router, Request, Response } from 'express';
import { createStore, findStore, getStores, updateStore } from '../models/store';
import { checkLogin } from '../middleware';

const storeRouter = Router();
storeRouter.use(checkLogin);

storeRouter.post('/', async (req: Request, res: Response) => {
    const { name, address, telephone, open_time, close_time } = req.body;

    // Validate request body
    if (!name || !address || !telephone || !open_time || !close_time) {
        res.status(400).json({
            message: "All fields are required"
        });
        return;
    }

    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(open_time) || !timeRegex.test(close_time)) {
        res.status(400).json({
            message: "Open time and close time must be strings in HH:mm format"
        });
        return;
    }

    try {
        if (await findStore({ name })) {
            res.status(400).json({
                message: "Store with this name already exists"
            });
            return;
        }

        await createStore({
            name,
            address,
            telephone,
            open_time,
            close_time,
        });

        res.status(201).json({
            message: "Store created successfully"
        });
    }
    catch (error) {
        console.error("Error creating store:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

storeRouter.get('/', async (req: Request, res: Response) => {
    try {
        const stores = await getStores();
        res.status(200).json(stores);
    }
    catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

storeRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const store = await findStore({ id: parseInt(req.params.id) });
        if (!store) {
            res.status(404).json({
                message: "Store not found"
            });
            return;
        }
        res.status(200).json(store);
    }
    catch (error) {
        console.error("Error fetching store:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

storeRouter.put('/:id', async (req: Request, res: Response) => {
    const { name, address, telephone, open_time, close_time } = req.body;

    // Validate request body
    if (!name || !address || !telephone || !open_time || !close_time) {
        res.status(400).json({
            message: "All fields are required"
        });
        return;
    }

    try {
        const store = await findStore({ id: parseInt(req.params.id) });
        if (!store) {
            res.status(404).json({
                message: "Store not found"
            });
            return;
        }

        await updateStore({
            id: parseInt(req.params.id),
            name,
            address,
            telephone,
            open_time,
            close_time,
        });

        res.status(200).json({
            message: "Store updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating store:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default storeRouter;
