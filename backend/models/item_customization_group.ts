import { db } from '../database/db';
import { ItemCustomizationGroup, ItemCustomizationGroupInsert, ItemCustomizationGroupUpdate } from '../database/schema';

export async function createItemCustomizationGroup(itemCustomizationGroup: ItemCustomizationGroupInsert) {
    return await db
        .insertInto('item_customization_group')
        .values(itemCustomizationGroup)
        .executeTakeFirstOrThrow();
}

export async function getItemCustomizationGroups() {
    return await db
        .selectFrom('item_customization_group')
        .selectAll()
        .execute();
}

export async function findItemCustomizationGroup(data: Partial<ItemCustomizationGroup>) {
    let query = db.selectFrom('item_customization_group');

    if (data.id) {
        query = query.where('item_customization_group.id', '=', data.id);
    }

    if (data.item_id) {
        query = query.where('item_customization_group.item_id', '=', data.item_id);
    }

    if (data.customization_group_id) {
        query = query.where('item_customization_group.customization_group_id', '=', data.customization_group_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function updateItemCustomizationGroup(data: ItemCustomizationGroupUpdate) {
    if (!data.id) {
        throw new Error("ID is required for updating item customization group");
    }

    return await db
        .updateTable('item_customization_group')
        .set(data)
        .where('item_customization_group.id', '=', data.id)
        .executeTakeFirstOrThrow();
}

export async function deleteItemCustomizationGroup(data: Partial<ItemCustomizationGroup>) {
    let query = db.deleteFrom('item_customization_group');

    if (data.id) {
        query = query.where('item_customization_group.id', '=', data.id);
    }

    if (data.item_id) {
        query = query.where('item_customization_group.item_id', '=', data.item_id);
    }

    if (data.customization_group_id) {
        query = query.where('item_customization_group.customization_group_id', '=', data.customization_group_id);
    }

    return await query.execute();
}
