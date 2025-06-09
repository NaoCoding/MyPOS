import { db } from '../database/db';
import { Customization, CustomizationInsert, CustomizationUpdate } from '../database/schema';

export async function createCustomization(customization: CustomizationInsert) {
    return await db
        .insertInto('customization')
        .values(customization)
        .executeTakeFirstOrThrow();
}

export async function getCustomizations() {
    return await db
        .selectFrom('customization')
        .innerJoin('customization_group', 'customization.customization_group_id', 'customization_group.id')
        .select([
            'customization.id',
            'customization.name',
            'customization_group.id as customization_group_id',
            'customization_group.name as customization_group_name',
            'customization.description',
            'customization.price_delta',
            'customization.is_available'
        ])
        .execute();
}

export async function findCustomization(data: Partial<Customization>) {
    let query = db.selectFrom('customization');

    if (data.id) {
        query = query.where('customization.id', '=', data.id);
    }

    if (data.name) {
        query = query.where('customization.name', '=', data.name);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function findCustomizationsByGroupID(customizationGroupId: number) {
    return await db
        .selectFrom('customization')
        .where('customization.customization_group_id', '=', customizationGroupId)
        .selectAll()
        .execute();
}

export async function updateCustomization(customization: CustomizationUpdate) {
    if (!customization.id) {
        throw new Error('id is required to update customization');
    }

    return await db
        .updateTable('customization')
        .set(customization)
        .where('id', '=', customization.id)
        .executeTakeFirstOrThrow();
}

export async function deleteCustomization(customization: CustomizationUpdate) {
    if (!customization.id) {
        throw new Error('id is required to delete customization');
    }

    return await db
        .deleteFrom('customization')
        .where('id', '=', customization.id)
        .executeTakeFirstOrThrow();
}
