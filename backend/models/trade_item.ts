import { db } from '../database/db';
import { TradeItem, TradeItemInsert, TradeItemUpdate } from '../database/schema';

export async function createTradeItem(tradeItem: TradeItemInsert) {
    return await db
        .insertInto('trade_item')
        .values(tradeItem)
        .executeTakeFirstOrThrow();
}

export async function getTradeItems() {
    return await db
        .selectFrom('trade_item')
        .selectAll()
        .execute();
}

export async function findTradeItem(data: Partial<TradeItem>) {
    let query = db.selectFrom('trade_item');

    if (data.id) {
        query = query.where('trade_item.id', '=', data.id);
    }

    if (data.trade_id) {
        query = query.where('trade_item.trade_id', '=', data.trade_id);
    }

    if (data.item_id) {
        query = query.where('trade_item.item_id', '=', data.item_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function updateTradeItem(data: TradeItemUpdate) {
    if (!data.id) {
        throw new Error("ID is required for updating trade item");
    }

    return await db
        .updateTable('trade_item')
        .set(data)
        .where('trade_item.id', '=', data.id)
        .executeTakeFirstOrThrow();
}

export async function deleteTradeItem(data: Partial<TradeItem>) {
    if (!data.id) {
        throw new Error("ID is required for deleting trade item");
    }

    return await db
        .deleteFrom('trade_item')
        .where('trade_item.id', '=', data.id)
        .executeTakeFirstOrThrow(); 
}
