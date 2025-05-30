import { Router, Request, Response } from 'express';
import { createItem, findItem, getItems, updateItem } from '../models/item';
import { checkLogin } from '../middleware';
import { findProduct } from '../models/product';
import { findStore } from '../models/store';
import { findCurrentPrice } from '../models/price';

const itemRouter = Router();
itemRouter.use(checkLogin);

itemRouter.post('/', async (req: Request, res: Response) => {
    const { product_id, store_id, quantity } = req.body;

    // Validate request body
    if (!product_id || !store_id || !quantity) {
        res.status(400).json({
            message: "Product ID, Store ID, and Quantity are required"
        });
        return;
    }

    try {
        if (await findProduct({ id: product_id }) === undefined) {
            res.status(400).json({
                message: "Product with this ID does not exist"
            });
            return;
        }
        else if (await findStore({ id: store_id }) === undefined) {
            res.status(400).json({
                message: "Store with this ID does not exist"
            });
            return;
        }
        else if (await findItem({ product_id, store_id })) {
            res.status(400).json({
                message: "Item with this Product ID and Store ID already exists"
            });
            return;
        }
        else if (quantity <= 0) {
            res.status(400).json({
                message: "Quantity must be greater than 0"
            });
            return;
        }

        await createItem({
            product_id,
            store_id,
            quantity,
        });

        res.status(201).json({
            message: "Item created successfully"
        });
    }
    catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

itemRouter.get('/', async (req: Request, res: Response) => {
    try {
        const items = await getItems();
        res.status(200).json(items);
    }
    catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

itemRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const item = await findItem({ id: parseInt(req.params.id) });
        if (!item) {
            res.status(404).json({
                message: "Item not found"
            });
            return;
        }

        const price = await findCurrentPrice({ item_id: item.id });

        res.status(200).json({
            item,
            price: price ? price.unit_price : 0
        });
    }
    catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

itemRouter.put('/:id', async (req: Request, res: Response) => {
    const { quantity } = req.body;

    // Validate request body
    if (!quantity) {
        res.status(400).json({
            message: "Quantity is required"
        });
        return;
    }

    try {
        const item = await findItem({ id: parseInt(req.params.id) });

        if (!item) {
            res.status(404).json({
                message: "Item not found"
            });
            return;
        }
        else if (quantity <= 0) {
            res.status(400).json({
                message: "Quantity must be greater than 0"
            });
            return;
        }

        await updateItem({
            id: parseInt(req.params.id),
            quantity,
        });

        res.status(200).json({
            message: "Item updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default itemRouter;
