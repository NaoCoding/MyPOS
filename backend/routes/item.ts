import { Router, Request, Response } from 'express';
import { createItem, findCustomizationGroupOfItem, findItem, findItemWithPriceAndDiscount, getItemsWithPriceAndDiscount, updateItem } from '../models/item';
import { checkLogin } from '../middleware';
import { findProduct } from '../models/product';
import { createPrice, updatePrice } from '../models/price';
import { findCustomizationGroup } from '../models/customization_group';
import { createItemCustomizationGroup, deleteItemCustomizationGroup, findItemCustomizationGroup } from '../models/item_customization_group';

const itemRouter = Router();
itemRouter.use(checkLogin);

itemRouter.post('/', async (req: Request, res: Response) => {
    const { product_id, quantity, unit_price, customization_group } = req.body;

    // Validate request body
    if (!product_id || !quantity) {
        res.status(400).json({
            message: "Product ID and quantity are required"
        });
        return;
    }
    else if (quantity <= 0) {
        res.status(400).json({
            message: "Quantity must be greater than 0"
        });
        return;
    }
    else if (unit_price && unit_price <= 0) {
        res.status(400).json({
            message: "Price must be greater than 0"
        });
        return;
    }
    else if (customization_group && customization_group.length === 0) {
        res.status(400).json({
            message: "Customization group cannot be empty"
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
        else if (await findItem({ product_id }) !== undefined) {
            res.status(400).json({
                message: "Item with this product ID already exists"
            });
            return;
        }

        const item = await createItem({ product_id, quantity });
        const item_id = Number(item.insertId);

        if (unit_price) {
            await createPrice({
                item_id,
                unit_price
            });
        }

        if (customization_group) {
            for (const customization_group_id of customization_group) {
                if (!await findCustomizationGroup({ id: Number(customization_group_id) })) {
                    res.status(404).json({
                        message: `Customization group with ID ${customization_group_id} not found`
                    });
                    return;
                }

                const itemCustomizationGroup = await findItemCustomizationGroup({ 
                    item_id,
                    customization_group_id: Number(customization_group_id)
                });

                if (itemCustomizationGroup) {
                    res.status(400).json({
                        message: `Item already has customization group with ID ${customization_group_id}`
                    });
                    return;
                }

                await createItemCustomizationGroup({
                    item_id,
                    customization_group_id: Number(customization_group_id)
                });
            }
        }

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
        const items = await getItemsWithPriceAndDiscount();
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
    const { id } = req.params;

    try {
        const item = await findItemWithPriceAndDiscount({ id: Number(id) });
        const customizationGroups = await findCustomizationGroupOfItem(Number(id));

        if (!item) {
            res.status(404).json({
                message: "Item not found"
            });
            return;
        }

        res.status(200).json({
            ...item,
            customization_groups: customizationGroups
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
    const { id } = req.params;
    const { product_id, quantity, unit_price, customization_group } = req.body;

    // Validate request body
    if (!id || !product_id || !quantity || !customization_group) {
        res.status(400).json({
            message: "ID, Product ID, Quantity, and Customization Group are required"
        });
        return;
    }
    else if (quantity <= 0) {
        res.status(400).json({
            message: "Quantity must be greater than 0"
        });
        return;
    }
    else if (unit_price && unit_price <= 0) {
        res.status(400).json({
            message: "Price must be greater than 0"
        });
        return;
    }

    try {
        const item = await findItem({ id: Number(id) });

        if (!item) {
            res.status(404).json({
                message: "Item not found"
            });
            return;
        }

        await updateItem({ id: Number(id), quantity });

        if (unit_price) {
            // await updatePrice({ item_id: Number(id), unit_price });
        }

        if (customization_group) {
            const existingGroups = await findCustomizationGroupOfItem(Number(id));
            const existingGroupIds = existingGroups.map(group => group.id);

            // Remove groups that are no longer associated
            for (const group of existingGroups) {
                if (!customization_group.includes(group.id)) {
                    await deleteItemCustomizationGroup({
                        item_id: Number(id),
                        customization_group_id: group.id
                    });
                }
            }

            // Add new groups
            for (const customization_group_id of customization_group) {
                if (!existingGroupIds.includes(Number(customization_group_id))) {
                    if (!await findCustomizationGroup({ id: Number(customization_group_id) })) {
                        res.status(404).json({
                            message: `Customization group with ID ${customization_group_id} not found`
                        });
                        return;
                    }

                    await createItemCustomizationGroup({
                        item_id: Number(id),
                        customization_group_id: Number(customization_group_id)
                    });
                }
            }
        }

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
