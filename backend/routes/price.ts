import { Router, Request, Response } from 'express';
import { createPrice, findPrice, getPrices, updatePrice } from '../models/price';
import { checkLogin } from '../middleware';
import { findItem } from '../models/item';

const priceRouter = Router();
priceRouter.use(checkLogin);

priceRouter.post('/', async (req: Request, res: Response) => {
    const { item_id, unit_price, start_datetime, end_datetime } = req.body;

    // Validate request body
    if (!item_id || !unit_price || !start_datetime) {
        res.status(400).json({
            message: "Item ID, Unit Price, and Start Datetime are required"
        });
        return;
    }
    else if (typeof unit_price !== 'number' || unit_price <= 0) {
        res.status(400).json({
            message: "Unit Price must be a positive number"
        });
        return;
    }

    try {
        const item = await findItem({ id: item_id });
        if (!item) {
            res.status(400).json({
                message: "Item with this ID does not exist"
            });
            return;
        }

        const newPrice = await createPrice({
            item_id,
            unit_price,
            start_datetime,
            end_datetime: end_datetime || null,
        });

        res.status(201).json({
            message: "Price created successfully",
            price: newPrice
        });
    }
    catch (error) {
        console.error("Error creating price:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

priceRouter.get('/', async (req: Request, res: Response) => {
    try {
        const prices = await getPrices();
        res.status(200).json(prices);
    }
    catch (error) {
        console.error("Error fetching prices:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

priceRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const price = await findPrice({ id: Number(id) });
        if (!price) {
            res.status(404).json({
                message: "Price not found"
            });
            return;
        }
        res.status(200).json(price);
    }
    catch (error) {
        console.error("Error fetching price:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

priceRouter.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { item_id, unit_price, start_datetime, end_datetime } = req.body;

    // Validate request body
    if (!item_id || !unit_price || !start_datetime) {
        res.status(400).json({
            message: "Item ID, Unit Price, and Start Datetime are required"
        });
        return;
    }
    else if (typeof unit_price !== 'number' || unit_price <= 0) {
        res.status(400).json({
            message: "Unit Price must be a positive number"
        });
        return;
    }

    try {
        const price = await findPrice({ id: Number(id) });
        if (!price) {
            res.status(404).json({
                message: "Price not found"
            });
            return;
        }

        const updatedPrice = await updatePrice({
            id: Number(id),
            item_id,
            unit_price,
            start_datetime,
            end_datetime: end_datetime || null,
        });

        res.status(200).json({
            message: "Price updated successfully",
            price: updatedPrice
        });
    }
    catch (error) {
        console.error("Error updating price:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default priceRouter;
