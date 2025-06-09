import { Router, Request, Response } from 'express';
import { createItem, deleteItem, findItem, findItemWithPriceAndDiscount, getItemsWithPriceAndDiscount, updateItem } from '../models/item';
import { checkLogin } from '../middleware';
import { findProduct } from '../models/product';
import { createPrice, updatePrice } from '../models/price';
import { findCustomizationGroup, findCustomizationGroupByItemID } from '../models/customization_group';
import { createItemCustomizationGroup, deleteItemCustomizationGroup, findItemCustomizationGroup } from '../models/item_customization_group';
import { createDiscount, updateDiscount } from '../models/discount';
import { findCustomizationsByGroupID } from '../models/customization';

const itemRouter = Router();
itemRouter.use(checkLogin);

itemRouter.post('/', async (req: Request, res: Response) => {
    const { product_id, quantity, unit_price, discount_type, discount_amount, customization_group } = req.body;

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
    else if (discount_type && discount_amount && (discount_type !== 'percentage' && discount_type !== 'fixed')) {
        res.status(400).json({
            message: "Discount type must be 'percentage' or 'fixed'"
        });
        return;
    }
    else if (discount_type && !discount_amount) {
        res.status(400).json({
            message: "Discount amount is required when discount type is provided"
        });
        return;
    }
    else if (discount_amount && discount_amount <= 0) {
        res.status(400).json({
            message: "Discount amount must be greater than 0"
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

        if (discount_type && discount_amount) {
            await createDiscount({
                item_id,
                type: discount_type,
                amount: discount_amount
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
        const rawItems = await getItemsWithPriceAndDiscount();
        let items = [];

        // TODO: Optimize this by fetching customization groups in bulk
        for (const item of rawItems) {
            const groups = await getItemCustomizationGroups(item.id);
            items.push({
                ...item,
                customization_groups: groups
            });
        }

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

        if (!item) {
            res.status(404).json({
                message: "Item not found"
            });
            return;
        }

        const groups = await getItemCustomizationGroups(Number(id));

        res.status(200).json({
            ...item,
            customization_groups: groups
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
    const { product_id, quantity, unit_price, discount_type, discount_amount, customization_group } = req.body;

    // Validate request body
    if (!id || !product_id || !quantity || !customization_group) {
        res.status(400).json({
            message: "ID, product ID, quantity are required"
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
    else if (discount_type && discount_amount && (discount_type !== 'percentage' && discount_type !== 'fixed')) {
        res.status(400).json({
            message: "Discount type must be 'percentage' or 'fixed'"
        });
        return;
    }
    else if ((discount_type && !discount_amount) || (!discount_type && discount_amount)) {
        res.status(400).json({
            message: "Discount type and amount must be provided together"
        });
        return;
    }
    else if (discount_amount && discount_amount <= 0) {
        res.status(400).json({
            message: "Discount amount must be greater than 0"
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

        await updateItem({
            id: Number(id),
            product_id,
            quantity
        });

        if (unit_price) {
            const existingPrice = await findItem({ id: Number(id) });

            if (!existingPrice) {
                await createPrice({
                    item_id: Number(id),
                    unit_price
                });
            }
            else {
                await updatePrice({
                    item_id: Number(id),
                    unit_price
                });
            }
        }

        if (discount_type && discount_amount) {
            const existingDiscount = await findItem({ id: Number(id) });

            if (!existingDiscount) {
                await createDiscount({
                    item_id: Number(id),
                    type: discount_type,
                    amount: discount_amount
                });
            }
            else {
                await updateDiscount({
                    item_id: Number(id),
                    type: discount_type,
                    amount: discount_amount
                });
            }
        }

        const existingGroups = await findCustomizationGroupByItemID(Number(id));
        const existingGroupIds = existingGroups.map(group => group.id);

        // Remove groups that are no longer associated
        for (const group of existingGroups) {
            if (group.id && !customization_group.includes(group.id)) {
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

itemRouter.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const item = await findItem({ id: Number(id) });
        if (!item) {
            res.status(404).json({
                message: "Item not found"
            });
            return;
        }

        await deleteItem({ id: Number(id) });

        res.status(200).json({
            message: "Item deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

itemRouter.post('/customization-group', async (req: Request, res: Response) => {
    const { item_id, customization_group_id } = req.body;

    if (!item_id || !customization_group_id) {
        res.status(400).json({
            message: "Item ID and customization group ID are required"
        });
        return;
    }

    try {
        const item = await findItem({ id: Number(item_id) });
        const group = await findCustomizationGroup({ id: Number(customization_group_id) });

        if (!item) {
            res.status(404).json({
                message: "Item not found"
            });
            return;
        }

        if (!group) {
            res.status(404).json({
                message: "Customization group not found"
            });
            return;
        }

        const existingItemCustomizationGroup = await findItemCustomizationGroup({
            item_id: Number(item_id),
            customization_group_id: Number(customization_group_id)
        });

        if (existingItemCustomizationGroup) {
            res.status(400).json({
                message: "Item already has this customization group"
            });
            return;
        }

        await createItemCustomizationGroup({
            item_id: Number(item_id),
            customization_group_id: Number(customization_group_id)
        });

        res.status(201).json({
            message: "Item customization group created successfully"
        });
    }
    catch (error) {
        console.error("Error creating item customization group:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

async function getItemCustomizationGroups(itemId: number) {
    const customizationGroups = await findCustomizationGroupByItemID(itemId);

    let groups = [];

    for (const group of customizationGroups) {
        if (!group.id) {
            groups.push({
                ...group,
                customizations: []
            });
            continue;
        }

        const customizations = await findCustomizationsByGroupID(group.id);

        groups.push({
            ...group,
            customizations: customizations.map(customization => ({
                id: customization.id,
                name: customization.name,
                description: customization.description
            }))
        });
    }

    return groups;
}

export default itemRouter;