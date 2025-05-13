import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('user')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('username', 'text', (col) => col.notNull().unique())
        .addColumn('email', 'text', (col) => col.notNull().unique())
        .addColumn('telephone', 'text', (col) => col.notNull().unique())
        .addColumn('password', 'text', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.defaultTo(Date.now()))
        .addColumn('updated_at', 'datetime', (col) => col.defaultTo(Date.now()))
        .addColumn('deleted_at', 'datetime')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('user').execute();
}
