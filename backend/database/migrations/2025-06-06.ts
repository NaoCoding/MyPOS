import { sql, Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('product')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.defaultTo(null))
        .execute();

    await db.schema
        .createTable('item')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('product_id', 'integer', (col) => col.notNull())
        .addColumn('quantity', 'integer', (col) => col.notNull())
        .addForeignKeyConstraint('fk_product_id', ['product_id'], 'product', ['id'], (col) =>
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
        .addForeignKeyConstraint('fk_item_id', ['item_id'], 'item', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('discount')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('type', 'varchar', (col) => col.notNull().check(sql`type IN ('percentage', 'fixed')`))
        .addColumn('amount', 'decimal', (col) => col.notNull())
        .addColumn('start_datetime', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('end_datetime', 'datetime', (col) => col.defaultTo(null))
        .addForeignKeyConstraint('fk_item_id', ['item_id'], 'item', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('customization_group')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.defaultTo(null))
        .addColumn('is_required', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('is_multiple_choice', 'boolean', (col) => col.notNull().defaultTo(false))
        .execute();

    await db.schema
        .createTable('item_customization_group')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('customization_group_id', 'integer', (col) => col.notNull())
        .addForeignKeyConstraint('fk_item_id', ['item_id'], 'item', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .addForeignKeyConstraint('fk_customization_group_id', ['customization_group_id'], 'customization_group', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('customization')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('customization_group_id', 'integer', (col) => col.notNull())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.defaultTo(null))
        .addColumn('is_available', 'boolean', (col) => col.notNull())
        .addColumn('price_delta', 'decimal', (col) => col.defaultTo(0))
        .addForeignKeyConstraint('fk_customization_group_id', ['customization_group_id'], 'customization_group', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('trade')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('user_id', 'integer', (col) => col.notNull())
        .addColumn('trade_datetime', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('status', 'varchar', (col) => col.notNull().check(sql`status IN ('pending', 'completed')`))
        .addForeignKeyConstraint('fk_user_id', ['user_id'], 'user', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('trade_item')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('trade_id', 'integer', (col) => col.notNull())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('quantity', 'integer', (col) => col.notNull())
        .addForeignKeyConstraint('fk_trade_id', ['trade_id'], 'trade', ['id'],
            (col) => col.onDelete('cascade').onUpdate('cascade')
        )
        .addForeignKeyConstraint('fk_item_id', ['item_id'], 'item', ['id'],
            (col) => col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('trade_item_customization')
        .addColumn('trade_item_id', 'integer', (col) => col.notNull())
        .addColumn('customization_id', 'integer', (col) => col.notNull())
        .addColumn('price_delta_snapshot' , 'decimal', (col) => col.notNull())
        .addForeignKeyConstraint('fk_trade_item_id', ['trade_item_id'], 'trade_item', ['id'],
            (col) => col.onDelete('cascade').onUpdate('cascade')
        )
        .addForeignKeyConstraint('fk_customization_id', ['customization_id'], 'customization', ['id'],
            (col) => col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('manufacturer')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name' , 'varchar', (col) => col.notNull())
        .addColumn('telephone', 'varchar', (col) => col.defaultTo(null))
        .addColumn('address', 'varchar', (col) => col.defaultTo(null))
        .execute();

    await db.schema
        .createTable('purchase_order')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('manufacturer_id', 'integer', (col) => col.notNull())
        .addColumn('user_id' , 'integer', (col) => col.notNull())
        .addColumn('order_datetime', 'datetime', (col) => col.notNull().defaultTo(new Date().toISOString()))
        .addColumn('status' , 'varchar', (col) => col.notNull().check(sql`status IN ('pending', 'delivered')`))
        .addForeignKeyConstraint('fk_manufacturer_id', ['manufacturer_id'], 'manufacturer', ['id'], 
            (col) => col.onUpdate('cascade').onDelete('cascade')
        )
        .addForeignKeyConstraint('fk_user_id', ['user_id'], 'user', ['id'],
            (col) => col.onUpdate('cascade').onDelete('cascade')
        )
        .execute();

    await db.schema
        .createTable('purchase_order_item')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('purchase_order_id', 'integer', (col) => col.notNull())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('quantity', 'integer', (col) => col.notNull())
        .addForeignKeyConstraint('fk_purchase_order_id', ['purchase_order_id'], 'purchase_order', ['id'],
            (col) => col.onUpdate('cascade').onDelete('cascade')
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('purchase_order_item').execute();
    await db.schema.dropTable('purchase_order').execute();
    await db.schema.dropTable('manufacturer').execute();
    await db.schema.dropTable('trade_item_customization').execute();
    await db.schema.dropTable('trade_item').execute();
    await db.schema.dropTable('trade').execute();
    await db.schema.dropTable('customization').execute();
    await db.schema.dropTable('item_customization_group').execute();
    await db.schema.dropTable('customization_group').execute();
    await db.schema.dropTable('discount').execute();
    await db.schema.dropTable('price').execute();
    await db.schema.dropTable('item').execute();
    await db.schema.dropTable('product').execute();
}
