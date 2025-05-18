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
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('product').execute();
}
