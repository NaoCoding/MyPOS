import { db } from '../database/db';
import { Item, ItemInsert, ItemUpdate } from '../database/schema';

export async function createItem(item: ItemInsert) {
    return await db
        .insertInto('item')
        .values(item)
        .executeTakeFirstOrThrow();
}

export async function getItems() {
    return await db
        .selectFrom('item')
        .where('item.deleted_at', 'is', null)
        .selectAll()
        .execute();
}

export async function findItem(data: Partial<Item>) {
    let query = db.selectFrom('item').where('item.deleted_at', 'is', null);

    if (data.id) {
        query = query.where('item.id', '=', data.id);
    }

    if (data.product_id) {
        query = query.where('item.product_id', '=', data.product_id);
    }

    if (data.store_id) {
        query = query.where('item.store_id', '=', data.store_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function updateItem(item: ItemUpdate) {
    if (!item.id) {
        throw new Error('id is required to update item');
    }

    return await db
        .updateTable('item')
        .set(item)
        .where('id', '=', item.id)
        .executeTakeFirstOrThrow();
}

export async function deleteItem(item: ItemUpdate) {
    if (!item.id) {
        throw new Error('id is required to delete item');
    }

    return await db
        .updateTable('item')
        .set({ deleted_at: new Date().toISOString() })
        .where('id', '=', item.id)
        .executeTakeFirstOrThrow();
}
