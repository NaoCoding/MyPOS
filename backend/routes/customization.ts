import { Router, Request, Response } from 'express';
import {
    createCustomizationGroup,
    getCustomizationsFromGroup,
    getCustomizationGroups,
    updateCustomizationGroup,
    findCustomizationGroup
} from '../models/customization_group';
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
        const groups = await getCustomizationGroups();
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

export default customizationRouter;
