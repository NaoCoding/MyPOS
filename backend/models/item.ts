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
        .selectAll()
        .execute();
}

export async function getItemsWithPriceAndDiscount() {
    return await db
        .selectFrom('item')
        .leftJoin('price', 'item.id', 'price.item_id')
        .leftJoin('discount', 'item.id', 'discount.item_id')
        .where('price.end_datetime', 'is', null)
        .where('discount.end_datetime', 'is', null)
        .select([
            'item.id',
            'item.product_id',
            'item.quantity',
            'price.unit_price',
            'discount.type as discount_type',
            'discount.amount as discount_amount'
        ])
        .execute();
}

export async function findItem(data: Partial<Item>) {
    let query = db.selectFrom('item');

    if (data.id) {
        query = query.where('item.id', '=', data.id);
    }

    if (data.product_id) {
        query = query.where('item.product_id', '=', data.product_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function findItemWithPriceAndDiscount(data: Partial<Item>) {
    let query = db.selectFrom('item')
        .leftJoin('price', 'item.id', 'price.item_id')
        .leftJoin('discount', 'item.id', 'discount.item_id')
        .where('price.end_datetime', 'is', null)
        .where('discount.end_datetime', 'is', null);

    if (data.id) {
        query = query.where('item.id', '=', data.id);
    }

    if (data.product_id) {
        query = query.where('item.product_id', '=', data.product_id);
    }

    return await query
        .select([
            'item.id',
            'item.product_id',
            'item.quantity',
            'price.unit_price',
            'discount.type as discount_type',
            'discount.amount as discount_amount'
        ])
        .executeTakeFirst();
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
        .deleteFrom('item')
        .where('id', '=', item.id)
        .executeTakeFirstOrThrow();
}
