import { db } from '../database/db';
import { TradeItemCustomization, TradeItemCustomizationInsert, TradeItemCustomizationUpdate } from '../database/schema';

export async function createTradeItemCustomization(customization: TradeItemCustomizationInsert) {
    return await db
        .insertInto('trade_item_customization')
        .values(customization)
        .executeTakeFirstOrThrow();
}

export async function getTradeItemCustomizations() {
    return await db
        .selectFrom('trade_item_customization')
        .selectAll()
        .execute();
}

export async function findTradeItemCustomization(data: Partial<TradeItemCustomization>) {
    let query = db.selectFrom('trade_item_customization');

    if (data.customization_id) {
        query = query.where('trade_item_customization.customization_id', '=', data.customization_id);
    }

    if (data.trade_item_id) {
        query = query.where('trade_item_customization.trade_item_id', '=', data.trade_item_id);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function deleteTradeItemCustomization(data: Partial<TradeItemCustomization>) {
    if (!data.customization_id) {
        throw new Error("Customization ID is required for deleting trade item customization");
    }

    if (!data.trade_item_id) {
        throw new Error("Trade item ID is required for deleting trade item customization");
    }

    return await db
        .deleteFrom('trade_item_customization')
        .where('trade_item_customization.customization_id', '=', data.customization_id)
        .where('trade_item_customization.trade_item_id', '=', data.trade_item_id)
        .executeTakeFirstOrThrow();
}
