import { db } from '../database/db';
import { CustomizationGroup, CustomizationGroupInsert, CustomizationGroupUpdate } from '../database/schema';

export async function createCustomizationGroup(customizationGroup: CustomizationGroupInsert) {
    return await db
        .insertInto('customization_group')
        .values(customizationGroup)
        .executeTakeFirstOrThrow();
}

export async function getCustomizationGroups() {
    return await db
        .selectFrom('customization_group')
        .selectAll()
        .execute();
}

export async function findCustomizationGroup(data: Partial<CustomizationGroup>) {
    let query = db.selectFrom('customization_group');

    if (data.id) {
        query = query.where('customization_group.id', '=', data.id);
    }

    if (data.name) {
        query = query.where('customization_group.name', '=', data.name);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function findCustomizationGroupByItemID(itemId: number) {
    return await db
        .selectFrom('customization_group')
        .leftJoin('item_customization_group', 'customization_group.id', 'item_customization_group.customization_group_id')
        .where('item_customization_group.item_id', '=', itemId)
        .selectAll('customization_group')
        .execute();
}

export async function getCustomizationsFromGroup(customizationGroupId: number) {
    return await db
        .selectFrom('customization')
        .where('customization.customization_group_id', '=', customizationGroupId)
        .selectAll()
        .execute();
}

export async function updateCustomizationGroup(customizationGroup: CustomizationGroupUpdate) {
    if (!customizationGroup.id) {
        throw new Error('id is required to update customization group');
    }

    return await db
        .updateTable('customization_group')
        .set(customizationGroup)
        .where('id', '=', customizationGroup.id)
        .executeTakeFirstOrThrow();
}

export async function deleteCustomizationGroup(customizationGroup: CustomizationGroupUpdate) {
    if (!customizationGroup.id) {
        throw new Error('id is required to delete customization group');
    }

    return await db
        .deleteFrom('customization_group')
        .where('id', '=', customizationGroup.id)
        .executeTakeFirstOrThrow();
}
