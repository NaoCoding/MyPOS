
import { db } from '../database/db';
import { PurchaseOrder, PurchaseOrderInsert, PurchaseOrderUpdate } from '../database/schema';

export async function createPurchaseOrder(purchaseOrder: PurchaseOrderInsert){
    return await db
        .insertInto('purchase_order')
        .values(purchaseOrder)
        .executeTakeFirstOrThrow();
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return await db
        .selectFrom('purchase_order')
        .selectAll()
        .execute();
}

export async function findPurchaseOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder | undefined> {
    let query = db.selectFrom('purchase_order');

    if (data.id) {
        query = query.where('purchase_order.id', '=', data.id);
    }
    
    if (data.manufacturer_id) {
        query = query.where('purchase_order.manufacturer_id', '=', data.manufacturer_id);
    }
    
    if (data.user_id) {
        query = query.where('purchase_order.user_id', '=', data.user_id);
    }
    
    return await query.selectAll().executeTakeFirst();
}

export async function updatePurchaseOrder(purchaseOrder: PurchaseOrderUpdate){
    if (!purchaseOrder.id) {
        throw new Error('id is required to update purchase order');
    }
    
    return await db
        .updateTable('purchase_order')
        .set(purchaseOrder)
        .where('id', '=', purchaseOrder.id)
        .executeTakeFirstOrThrow();
}

export async function deletePurchaseOrder(purchaseOrder: PurchaseOrderUpdate) {
    if (!purchaseOrder.id) {
        throw new Error('id is required to delete purchase order');
    }

    return await db
        .updateTable('purchase_order')
        .where('id', '=', purchaseOrder.id)
        .executeTakeFirstOrThrow();
}
