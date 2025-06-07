import { db } from '../database/db';
import { Discount, DiscountInsert, DiscountUpdate } from '../database/schema';

export async function createDiscount(discount: DiscountInsert) {
    return await db
        .insertInto('discount')
        .values(discount)
        .executeTakeFirstOrThrow();
}

export async function getDiscounts() {
    return await db
        .selectFrom('discount')
        .where('discount.deleted_at', 'is', null)
        .selectAll()
        .execute();
}

export async function findDiscount(data: Partial<Discount>) {
    let query = db.selectFrom('discount').where('discount.deleted_at', 'is', null);

    if (data.id) {
        query = query.where('discount.id', '=', data.id);
    }

    if (data.item_id) {
        query = query.where('discount.item_id', '=', data.item_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function findCurrentDiscount(data: Partial<Discount>) {
    let query = db.selectFrom('discount')
        .where('discount.deleted_at', 'is', null)
        .where('discount.end_datetime', 'is', null);

    if (data.id) {
        query = query.where('discount.id', '=', data.id);
    }

    if (data.item_id) {
        query = query.where('discount.item_id', '=', data.item_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function updateDiscount(discount: DiscountUpdate) {
    if (!discount.id) {
        throw new Error('id is required to update discount');
    }

    return await db
        .updateTable('discount')
        .set(discount)
        .where('id', '=', discount.id)
        .executeTakeFirstOrThrow();
}

export async function deleteDiscount(discount: DiscountUpdate) {
    if (!discount.id) {
        throw new Error('id is required to delete discount');
    }

    return await db
        .updateTable('discount')
        .set({ deleted_at: new Date().toISOString() })
        .where('id', '=', discount.id)
        .executeTakeFirstOrThrow();
}
