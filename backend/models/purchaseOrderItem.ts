// backend/models/purchaseOrderItem.ts
import { db } from '../database/db';
import { PurchaseOrderItem, PurchaseOrderItemInsert, PurchaseOrderItemUpdate } from '../database/schema';

export async function createPurchaseOrderItem(purchaseOrderItem: PurchaseOrderItemInsert){
    return await db
        .insertInto('purchase_order_item')
        .values(purchaseOrderItem)
        .executeTakeFirstOrThrow();
}

export async function getPurchaseOrderItems(): Promise<PurchaseOrderItem[]> {
    return await db
        .selectFrom('purchase_order_item')
        .selectAll()
        .execute();
}

export async function findPurchaseOrderItem(data: Partial<PurchaseOrderItem>): Promise<PurchaseOrderItem | undefined> {
    let query = db.selectFrom('purchase_order_item');
    
    if (data.id) {
        query = query.where('purchase_order_item.id', '=', data.id);
    }
    
    if (data.purchase_order_id) {
        query = query.where('purchase_order_item.purchase_order_id', '=', data.purchase_order_id);
    }
    
    if (data.item_id) {
        query = query.where('purchase_order_item.item_id', '=', data.item_id);
    }
    
    return await query.selectAll().executeTakeFirst();
}

export async function updatePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItemUpdate){
    if (!purchaseOrderItem.id) {
        throw new Error('id is required to update purchase order item');
    }
    
    return await db
        .updateTable('purchase_order_item')
        .set(purchaseOrderItem)
        .where('id', '=', purchaseOrderItem.id)
        .executeTakeFirstOrThrow();
}

export async function deletePurchaseOrderItem(purchaseOrderItem: PurchaseOrderItemUpdate) {
    if (!purchaseOrderItem.id) {
        throw new Error('id is required to delete purchase order item');
    }
    
    return await db
        .deleteFrom('purchase_order_item')
        .where('id', '=', purchaseOrderItem.id)
        .executeTakeFirstOrThrow();
}
