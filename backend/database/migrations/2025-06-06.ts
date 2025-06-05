import { type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('product')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.defaultTo(null))
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('deleted_at', 'datetime', (col) => col.defaultTo(null))
        .execute();

    await db.schema
        .createTable('item')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('product_id', 'integer', (col) => col.notNull())
        .addColumn('quantity', 'integer', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('deleted_at', 'datetime', (col) => col.defaultTo(null))
        .addForeignKeyConstraint('fk_item_product', ['product_id'], 'product', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('price')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('unit_price', 'decimal', (col) => col.notNull())
        .addColumn('start_datetime', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('end_datetime', 'datetime', (col) => col.defaultTo(null))
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('deleted_at', 'datetime', (col) => col.defaultTo(null))
        .addForeignKeyConstraint('fk_price_item', ['item_id'], 'item', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('discount')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('type', 'varchar', (col) => col.notNull())
        .addColumn('amount', 'decimal', (col) => col.notNull())
        .addColumn('start_datetime', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('end_datetime', 'datetime', (col) => col.defaultTo(null))
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('deleted_at', 'datetime', (col) => col.defaultTo(null))
        .addForeignKeyConstraint('fk_discount_item', ['item_id'], 'item', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('product').execute();
    await db.schema.dropTable('item').execute();
    await db.schema.dropTable('price').execute();
    await db.schema.dropTable('discount').execute();
}
