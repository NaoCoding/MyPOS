import { db } from '../database/db';
import { Product, ProductInsert, ProductUpdate } from '../database/schema';

export async function createProduct(product: ProductInsert) {
    return await db
        .insertInto('product')
        .values(product)
        .executeTakeFirstOrThrow();
}

export async function getProducts() {
    return await db
        .selectFrom('product')
        .selectAll()
        .execute();
}

export async function findProduct(data: Partial<Product>) {
    let query = db.selectFrom('product');

    if (data.id) {
        query = query.where('product.id', '=', data.id);
    }

    if (data.name) {
        query = query.where('product.name', '=', data.name);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function updateProduct(product: ProductUpdate) {
    if (!product.id) {
        throw new Error('id is required to update product');
    }

    return await db
        .updateTable('product')
        .set(product)
        .where('id', '=', product.id)
        .executeTakeFirstOrThrow();
}

export async function deleteProduct(product: ProductUpdate) {
    if (!product.id) {
        throw new Error('id is required to delete product');
    }

    return await db
        .deleteFrom('product')
        .where('id', '=', product.id)
        .executeTakeFirstOrThrow();
}
