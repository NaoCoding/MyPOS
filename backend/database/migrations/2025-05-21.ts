import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    // Create role table
    await db.schema
        .createTable('role')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull().unique())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('updated_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .execute();

    // Create permission table
    await db.schema
        .createTable('permission')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull().unique())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('updated_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .execute();

    // Create role_permission table
    await db.schema
        .createTable('role_permission')
        .addColumn('role_id', 'integer', (col) => col.notNull())
        .addColumn('permission_id', 'integer', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('updated_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_role_permission', ['role_id', 'permission_id'])
        .addForeignKeyConstraint('fk_role_id', ['role_id'], 'role', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .addForeignKeyConstraint('fk_permission_id', ['permission_id'], 'permission', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();
    
    await db.schema
        .alterTable('user')
        .addColumn('role_id', 'integer', (col) => 
            col.notNull().defaultTo(1)  
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {

    await db.schema
        .alterTable('user')
        .dropColumn('role_id')
        .execute();

    await db.schema.dropTable('role_permission').execute();
    await db.schema.dropTable('permission').execute();
    await db.schema.dropTable('role').execute();

    
}
