import { db } from '../database/db';
import { Price, PriceInsert, PriceUpdate } from '../database/schema';

export async function createPrice(price: PriceInsert) {
    return await db
        .insertInto('price')
        .values(price)
        .executeTakeFirstOrThrow();
}

export async function getPrices() {
    return await db
        .selectFrom('price')
        .where('price.deleted_at', 'is', null)
        .selectAll()
        .execute();
}

export async function findPrice(data: Partial<Price>) {
    let query = db.selectFrom('price').where('price.deleted_at', 'is', null);

    if (data.id) {
        query = query.where('price.id', '=', data.id);
    }

    if (data.item_id) {
        query = query.where('price.item_id', '=', data.item_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function updatePrice(price: PriceUpdate) {
    if (!price.id) {
        throw new Error('id is required to update price');
    }

    return await db
        .updateTable('price')
        .set(price)
        .where('id', '=', price.id)
        .executeTakeFirstOrThrow();
}

export async function deletePrice(price: PriceUpdate) {
    if (!price.id) {
        throw new Error('id is required to delete price');
    }

    return await db
        .updateTable('price')
        .set({ deleted_at: new Date().toISOString() })
        .where('id', '=', price.id)
        .executeTakeFirstOrThrow();
}
