import { type Kysely } from 'kysely';

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable('item')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('product_id', 'integer', (col) => col.notNull())
        .addColumn('store_id', 'integer', (col) => col.notNull())
        .addColumn('quantity', 'integer', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('deleted_at', 'datetime', (col) => col.defaultTo(null))
        .addForeignKeyConstraint('fk_item_product', ['product_id'], 'product', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .addForeignKeyConstraint('fk_item_store', ['store_id'], 'store', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable('item').ifExists().execute();
}
