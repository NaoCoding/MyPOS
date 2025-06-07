import { db } from '../database/db';
import { Manufacturer, ManufacturerInsert, ManufacturerUpdate } from '../database/schema';

export async function createManufacturer(manufacturer: ManufacturerInsert) {
    return await db
        .insertInto('manufacturer')
        .values(manufacturer)
        .executeTakeFirstOrThrow();
}

export async function getManufacturers() {
    return await db
        .selectFrom('manufacturer')
        .selectAll()
        .execute();
}

export async function findManufacturer(data: Partial<Manufacturer>) {
    let query = db.selectFrom('manufacturer');
    if (data.id) {
        query = query.where('manufacturer.id', '=', data.id);
    }
    if (data.name) {
        query = query.where('manufacturer.name', '=', data.name);
    }
    return await query.selectAll().executeTakeFirst();
}

export async function updateManufacturer(manufacturer: ManufacturerUpdate) {
    if (!manufacturer.id) {
        throw new Error('id is required to update manufacturer');
    }
    return await db
        .updateTable('manufacturer')
        .set(manufacturer)
        .where('id', '=', manufacturer.id)
        .executeTakeFirstOrThrow();
}
