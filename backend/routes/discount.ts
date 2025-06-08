import { Router, Request, Response } from 'express';
import { createDiscount, findDiscount, getDiscounts, updateDiscount } from '../models/discount';
import { checkLogin, requireClerk } from '../middleware';
import { findItem } from '../models/item';

const discountRouter = Router();
// discountRouter.use(requireClerk);
discountRouter.use(checkLogin);

discountRouter.post('/', async (req: Request, res: Response) => {
    const { item_id, type, amount } = req.body;

    // Validate request body
    if (!item_id || !type || !amount) {
        res.status(400).json({
            message: "Item ID, type, and amount are required"
        });
        return;
    }
    else if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({
            message: "Amount must be a positive number"
        });
        return;
    }
    else if (type !== 'percentage' && type !== 'fixed') {
        res.status(400).json({
            message: "Type must be either 'percentage' or 'fixed'"
        });
        return;
    }
    else if (type === 'percentage' && (amount < 0 || amount > 1)) {
        res.status(400).json({
            message: "Percentage amount must be between 0 and 1"
        });
        return;
    }

    try {
        const item = await findItem({ id: item_id });
        if (!item) {
            res.status(400).json({
                message: "Item with ID " + item_id + " does not exist"
            });
            return;
        }

        const itemDiscount = await findDiscount({ item_id });
        if (itemDiscount) {
            res.status(400).json({
                message: "Item ID " + item_id + " already has a discount"
            });
            return;
        }

        await createDiscount({ item_id, type, amount });

        res.status(201).json({
            message: "Discount created successfully",
        });
    }
    catch (error) {
        console.error("Error creating discount:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

discountRouter.get('/', async (req: Request, res: Response) => {
    try {
        const discounts = await getDiscounts();
        res.status(200).json(discounts);
    }
    catch (error) {
        console.error("Error fetching discounts:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

discountRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const discount = await findDiscount({ id: Number(id) });
        if (!discount) {
            res.status(404).json({
                message: "Discount not found"
            });
            return;
        }
        res.status(200).json(discount);
    }
    catch (error) {
        console.error("Error fetching discount:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

discountRouter.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { item_id, type, amount, end_datetime } = req.body;

    // Validate request body
    if (!item_id || !type || !amount) {
        res.status(400).json({
            message: "Item ID, type, and amount are required"
        });
        return;
    }
    else if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({
            message: "Amount must be a positive number"
        });
        return;
    }
    else if (type !== 'percentage' && type !== 'fixed') {
        res.status(400).json({
            message: "Type must be either 'percentage' or 'fixed'"
        });
        return;
    }
    else if (type === 'percentage' && (amount < 0 || amount > 1)) {
        res.status(400).json({
            message: "Percentage amount must be between 0 and 1"
        });
        return;
    }

    try {
        const item = await findItem({ id: item_id });
        if (!item) {
            res.status(400).json({
                message: "Item with ID " + item_id + " does not exist"
            });
            return;
        }

        const discount = await findDiscount({ id: Number(id) });
        if (!discount) {
            res.status(404).json({
                message: "Discount with ID " + id + " not found"
            });
            return;
        }

        await updateDiscount({ id: Number(id), item_id, type, amount, end_datetime });

        res.status(200).json({
            message: "Discount updated successfully",
        });
    }
    catch (error) {
        console.error("Error updating discount:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default discountRouter;
