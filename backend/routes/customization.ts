import { Router, Request, Response } from 'express';
import {
    createCustomizationGroup,
    getCustomizationsFromGroup,
    getCustomizationGroups,
    updateCustomizationGroup,
    findCustomizationGroup
} from '../models/customization_group';
import {
    createCustomization,
    getCustomizations,
    findCustomization,
    updateCustomization,
    deleteCustomization,
} from '../models/customization';
import { checkLogin } from '../middleware';

const customizationRouter = Router();
customizationRouter.use(checkLogin);

/**
 * Customization Group Routes
 */
customizationRouter.post('/group', async (req: Request, res: Response) => {
    const { name, description, is_required, is_multiple_choice } = req.body;

    if (!name) {
        res.status(400).json({ message: "Name is required" });
        return;
    }

    try {
        if (await findCustomizationGroup({ name })) {
            res.status(400).json({
                message: "Customization group with this name already exists"
            });
            return;
        }

        await createCustomizationGroup({
            name,
            description: description || null,
            is_required: is_required ? 1 : 0,
            is_multiple_choice: is_multiple_choice ? 1 : 0
        });

        res.status(201).json({ 
            message: "Customization group created successfully"
        });
    }
    catch (error) {
        console.error("Error creating customization group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

customizationRouter.get('/group', async (req: Request, res: Response) => {
    try {
        const rawGroups = await getCustomizationGroups();
        let groups = [];

        for (const group of rawGroups) {
            const customizations = await getCustomizationsFromGroup(group.id);

            groups.push({
                ...group,
                customizations: customizations || []
            });
        }

        res.status(200).json(groups);
    }
    catch (error) {
        console.error("Error fetching customization groups:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

customizationRouter.get('/group/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const group = await findCustomizationGroup({ id: Number(id) });

        if (!group) {
            res.status(404).json({
                message: "Customization group not found"
            });
            return;
        }

        const customizations = await getCustomizationsFromGroup(Number(id));

        res.status(200).json({ ...group, customizations });
    }
    catch (error) {
        console.error("Error fetching customization group:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

customizationRouter.put('/group/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, is_required, is_multiple_choice } = req.body;

    if (!id || !name) {
        res.status(400).json({ message: "ID and name are required" });
        return;
    }

    try {
        if (!await findCustomizationGroup({ id: Number(id) })) {
            res.status(404).json({
                message: "Customization group not found"
            });
            return;
        }

        const existingGroup = await findCustomizationGroup({ name });
        if (existingGroup && existingGroup.id !== Number(id)) {
            res.status(400).json({
                message: "Customization group with this name already exists"
            });
            return;
        }

        await updateCustomizationGroup({
            id: Number(id),
            name,
            description: description || null,
            is_required: is_required ? 1 : 0,
            is_multiple_choice: is_multiple_choice ? 1 : 0
        });

        res.status(200).json({ 
            message: "Customization group updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating customization group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * Customization Routes
 */

customizationRouter.post('/', async (req: Request, res: Response) => {
    const { name, customization_group_id, description, is_available, price_delta } = req.body;

    if (!name || !customization_group_id) {
        res.status(400).json({
            message: "Name and group ID are required"
        });
        return;
    }

    try {
        const customization = await findCustomization({ name });
        if (customization) {
            res.status(400).json({
                message: "Customization with this name already exists"
            });
            return;
        }

        if (!await findCustomizationGroup({ id: Number(customization_group_id) })) {
            res.status(404).json({
                message: "Customization group not found"
            });
            return;
        }

        let available = true;
        if (is_available !== undefined) {
            available = is_available;
        }

        await createCustomization({
            name,
            customization_group_id: Number(customization_group_id),
            description: description || null,
            is_available: available ? 1 : 0,
            price_delta: price_delta ? Number(price_delta) : 0
        });

        res.status(201).json({
            message: "Customization created successfully"
        });
    }
    catch (error) {
        console.error("Error creating customization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

customizationRouter.get('/', async (req: Request, res: Response) => {
    try {
        const customizations = await getCustomizations();
        res.status(200).json(customizations);
    }
    catch (error) {
        console.error("Error fetching customizations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

customizationRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const customization = await findCustomization({ id: Number(id) });

        if (!customization) {
            res.status(404).json({
                message: "Customization not found"
            });
            return;
        }

        res.status(200).json(customization);
    }
    catch (error) {
        console.error("Error fetching customization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

customizationRouter.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, customization_group_id, description, is_available, price_delta } = req.body;

    if (!id || !name || !customization_group_id) {
        res.status(400).json({ message: "ID, name, and group ID are required" });
        return;
    }

    try {
        if (!await findCustomization({ id: Number(id) })) {
            res.status(404).json({
                message: "Customization not found"
            });
            return;
        }

        const customization = await findCustomization({ name });
        if (customization && customization.id !== Number(id)) {
            res.status(400).json({
                message: "Customization with this name already exists"
            });
            return;
        }

        if (!await findCustomizationGroup({ id: Number(customization_group_id) })) {
            res.status(404).json({
                message: "Customization group not found"
            });
            return;
        }

        let available = true;
        if (is_available !== undefined) {
            available = is_available;
        }

        await updateCustomization({
            id: Number(id),
            name,
            customization_group_id: Number(customization_group_id),
            description: description || null,
            is_available: available ? 1 : 0,
            price_delta: price_delta ? Number(price_delta) : 0
        });

        res.status(200).json({ 
            message: "Customization updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating customization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

customizationRouter.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "ID is required" });
        return;
    }

    try {
        if (!await findCustomization({ id: Number(id) })) {
            res.status(404).json({
                message: "Customization not found"
            });
            return;
        }

        await deleteCustomization({ id: Number(id) });
        res.status(200).json({
            message: "Customization deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting customization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default customizationRouter;
