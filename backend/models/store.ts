import { db } from '../database/db';
import { Store, StoreInsert, StoreUpdate } from '../database/schema';

export async function createStore(store: StoreInsert) {
    return await db
        .insertInto('store')
        .values(store)
        .executeTakeFirstOrThrow();
}

export async function getStores() {
    return await db
        .selectFrom('store')
        .where('store.deleted_at', 'is', null)
        .selectAll()
        .execute();
}

export async function findStore(data: Partial<Store>) {
    let query = db.selectFrom('store').where('store.deleted_at', 'is', null);

    if (data.id) {
        query = query.where('store.id', '=', data.id);
    }

    if (data.name) {
        query = query.where('store.name', '=', data.name);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function updateStore(store: StoreUpdate) {
    if (!store.id) {
        throw new Error('id is required to update store');
    }

    return await db
        .updateTable('store')
        .set(store)
        .where('id', '=', store.id)
        .executeTakeFirstOrThrow();
}

export async function deleteStore(store: StoreUpdate) {
    if (!store.id) {
        throw new Error('id is required to delete store');
    }

    return await db
        .updateTable('store')
        .set({ deleted_at: new Date().toISOString() })
        .where('id', '=', store.id)
        .executeTakeFirstOrThrow();
}
