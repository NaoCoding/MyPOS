import { db } from '../database/db';
import { Trade, TradeInsert, TradeUpdate } from '../database/schema';

export async function createTrade(trade: TradeInsert) {
    return await db
        .insertInto('trade')
        .values(trade)
        .executeTakeFirstOrThrow();
}

export async function getTrades() {
    return await db
        .selectFrom('trade')
        .selectAll()
        .execute();
}

export async function findTrade(trade: Partial<Trade>) {
    let query = db.selectFrom('trade');

    if (trade.id) {
        query = query.where('trade.id', '=', trade.id);
    }

    if (trade.user_id) {
        query = query.where('trade.user_id', '=', trade.user_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function findUserTrades(userId: number) {
    return await db
        .selectFrom('trade')
        .where('trade.user_id', '=', userId)
        .selectAll()
        .execute();
}

export async function updateTrade(trade: TradeUpdate) {
    if (!trade.id) {
        throw new Error('Trade ID is required for update');
    }

    return await db
        .updateTable('trade')
        .set(trade)
        .where('id', '=', trade.id)
        .executeTakeFirstOrThrow();
}

export async function deleteTrade(trade: TradeUpdate) {
    if (!trade.id) {
        throw new Error('Trade ID is required for deletion');
    }

    return await db
        .deleteFrom('trade')
        .where('id', '=', trade.id)
        .executeTakeFirstOrThrow();
}
