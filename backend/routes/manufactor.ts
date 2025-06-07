import { Router, Request, Response } from 'express';
import { createManufactor, findManufactor, getManufactors, updateManufactor } from '../models/manufactor';
import { checkLogin } from '../middleware';

const manufactorRouter = Router();
manufactorRouter.use(checkLogin);

manufactorRouter.post('/', async (req: Request, res: Response) => {
    const { name, address } = req.body;

    // Validate request body
    if (!name) {
        res.status(400).json({
            message: "Name is required"
        });
        return;
    }

    try {
        const manufactor = await findManufactor({ name });
        if (manufactor) {
            res.status(400).json({
                message: "Manufactor with this name already exists"
            });
            return;
        }

        await createManufactor({
            name,
            address,
        });

        res.status(201).json({
            message: "Manufactor created successfully"
        });
    }
    catch (error) {
        console.error("Error creating manufactor:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

manufactorRouter.get('/', async (req: Request, res: Response) => {
    try {
        const manufactors = await getManufactors();
        res.status(200).json(manufactors);
    }
    catch (error) {
        console.error("Error fetching manufactors:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

manufactorRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const manufactor = await findManufactor({ id: parseInt(req.params.id) });
        if (!manufactor) {
            res.status(404).json({
                message: "Manufactor not found"
            });
            return;
        }
        res.status(200).json(manufactor);
    }
    catch (error) {
        console.error("Error fetching manufactor:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

manufactorRouter.put('/:id', async (req: Request, res: Response) => {
    const { name, address } = req.body;

    // Validate request body
    if (!name) {
        res.status(400).json({
            message: "Name is required"
        });
        return;
    }

    try {
        const manufactor = await findManufactor({ id: parseInt(req.params.id) });
        if (!manufactor) {
            res.status(404).json({
                message: "Manufactor not found"
            });
            return;
        }

        await updateManufactor({
            id: manufactor.id,
            name,
            address,
        });

        res.status(200).json({
            message: "Manufactor updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating manufactor:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default manufactorRouter;
