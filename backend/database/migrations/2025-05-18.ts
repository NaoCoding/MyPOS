import { type Kysely } from 'kysely';

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable('store')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('address', 'text', (col) => col.notNull())
        .addColumn('telephone', 'text', (col) => col.notNull())
        .addColumn('open_time', 'time', (col) => col.notNull())
        .addColumn('close_time', 'time', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('deleted_at', 'datetime', (col) => col.defaultTo(null))
        .ifNotExists()
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable('store').ifExists().execute();
}
