import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('session')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('user_id', 'integer', (col) => col.notNull())
        .addColumn('token', 'text', (col) => col.notNull().unique())
        .addColumn('expired_at', 'datetime', (col) => col.notNull())
        .addForeignKeyConstraint('fk_user_id', ['user_id'], 'user', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    
    await db.schema.dropTable('session').execute();
}
