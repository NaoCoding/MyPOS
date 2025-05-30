import { type Kysely } from 'kysely';

export async function up(db: Kysely<any>) {
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
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable('price').ifExists().execute();
}
