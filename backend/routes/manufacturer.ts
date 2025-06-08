import { Router, Request, Response } from 'express';
import { createManufacturer, findManufacturer, getManufacturers, updateManufacturer } from '../models/manufacturer';
import { checkLogin, requireClerk } from '../middleware';

const manufacturerRouter = Router();
// manufacturerRouter.use(requireClerk);
manufacturerRouter.use(checkLogin);

manufacturerRouter.post('/', async (req: Request, res: Response) => {
    const { name, address } = req.body;

    // Validate request body
    if (!name) {
        res.status(400).json({
            message: "Name is required"
        });
        return;
    }

    try {
        const manufacturer = await findManufacturer({ name });
        if (manufacturer) {
            res.status(400).json({
                message: "Manufacturer with this name already exists"
            });
            return;
        }

        await createManufacturer({
            name,
            address,
        });

        res.status(201).json({
            message: "Manufacturer created successfully"
        });
    }
    catch (error) {
        console.error("Error creating manufacturer:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

manufacturerRouter.get('/', async (req: Request, res: Response) => {
    try {
        const manufacturers = await getManufacturers();
        res.status(200).json(manufacturers);
    }
    catch (error) {
        console.error("Error fetching manufacturers:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

manufacturerRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const manufacturer = await findManufacturer({ id: parseInt(req.params.id) });
        if (!manufacturer) {
            res.status(404).json({
                message: "Manufacturer not found"
            });
            return;
        }
        res.status(200).json(manufacturer);
    }
    catch (error) {
        console.error("Error fetching manufacturer:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

manufacturerRouter.put('/:id', async (req: Request, res: Response) => {
    const { name, address } = req.body;

    // Validate request body
    if (!name) {
        res.status(400).json({
            message: "Name is required"
        });
        return;
    }

    try {
        const manufacturer = await findManufacturer({ id: parseInt(req.params.id) });
        if (!manufacturer) {
            res.status(404).json({
                message: "Manufacturer not found"
            });
            return;
        }

        await updateManufacturer({
            id: manufacturer.id,
            name,
            address,
        });

        res.status(200).json({
            message: "Manufacturer updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating manufacturer:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default manufacturerRouter;
