import { Router, Request, Response } from 'express';
import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from '../models/product';
import { checkLogin } from '../middleware';

const productRouter = Router();
productRouter.use(checkLogin);

productRouter.post('/', async (req: Request, res: Response) => {
    const { name, description, category } = req.body;

    // Validate request body
    if (!name) {
        res.status(400).json({
            message: "Name is required"
        });
        return;
    }

    try {
        const product = await findProduct({ name });
        if (product) {
            res.status(400).json({
                message: "Product with this name already exists"
            });
            return;
        }

        await createProduct({
            name,
            description,
            category
        });

        res.status(201).json({
            message: "Product created successfully"
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

productRouter.get('/', async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

productRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await findProduct({ id: parseInt(req.params.id, 10) });
        if (!product) {
            res.status(404).json({
                message: "Product not found"
            });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

productRouter.put('/:id', async (req: Request, res: Response) => {
    const { name, description, category } = req.body;

    // Validate request body
    if (!name) {
        res.status(400).json({
            message: "Name is required"
        });
        return;
    }

    try {
        const product = await findProduct({ id: parseInt(req.params.id) });
        if (!product) {
            res.status(404).json({
                message: "Product not found"
            });
            return;
        }

        await updateProduct({
            id: product.id,
            name,
            description,
            category
        });

        res.status(200).json({
            message: "Product updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

productRouter.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await findProduct({ id: Number(id) });
        if (!product) {
            res.status(404).json({
                message: "Product not found"
            });
            return;
        }

        await deleteProduct({ id: Number(id) });

        res.status(200).json({
            message: "Product deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default productRouter;
