import { sql, Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('product')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'varchar', (col) => col.notNull())
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
    

    await db.schema
        .createTable('customization_group')
        .addColumn('id', 'integer', (col) => col.notNull().autoIncrement())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_customization_group', ['id'])
        .execute();
    
    await db.schema
        .createTable('item_customization_group')
        .addColumn('id', 'integer', (col) => col.notNull())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('customization_group_id', 'integer', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_item_customization', ['id'])
        .addForeignKeyConstraint('fk_item_id', ['item_id'], 'item', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .addForeignKeyConstraint('fk_customization_group_id', ['customization_group_id'], 'customization_group', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    await db.schema
        .createTable('customization')
        .addColumn('id', 'integer', (col) => col.notNull())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('is_available', 'boolean', (col) => col.notNull())
        .addColumn('price_delta', 'decimal', (col) => col.notNull())
        .addColumn('customization_group_id', 'integer', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_customization', ['id'])
        .addForeignKeyConstraint('fk_customization_group_id', ['customization_group_id'], 'customization_group', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();

    
    await db.schema
        .createTable('trade')
        .addColumn('id', 'integer', (col) => col.notNull())
        .addColumn('user_id', 'integer', (col) => col.notNull())
        .addColumn('status', 'varchar', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_trade_id', ['id'])
        .addForeignKeyConstraint('fk_user_id', ['user_id'], 'user', ['id'], (col) =>
            col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();
    
    await db.schema
        .createTable('trade_item')
        .addColumn('id', 'integer', (col) => col.notNull())
        .addColumn('trade_id', 'integer', (col) => col.notNull())
        .addColumn('item_id', 'integer', (col) => col.notNull())
        .addColumn('quantity', 'integer', (col) => col.notNull())
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_trade_item_id', ['id'])
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
        .addColumn('price_delta_snapshot' , 'decimal')
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addForeignKeyConstraint('fk_trade_item_id', ['trade_item_id'], 'trade_item', ['id'],
            (col) => col.onDelete('cascade').onUpdate('cascade')
        )
        .addForeignKeyConstraint('fk_customization_id', ['customization_id'], 'customization', ['id'],
            (col) => col.onDelete('cascade').onUpdate('cascade')
        )
        .execute();
    
    await db.schema
        .createTable('manufacturer')
        .addColumn('id', 'integer', (col) => col.notNull())
        .addColumn('name' , 'varchar')
        .addColumn('telephone', 'varchar')
        .addColumn('address', 'varchar')
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_manufacturer_id', ['id'])
        .execute();
    
    await db.schema
        .createTable('purchase_order')
        .addColumn('id', 'integer', (col) => col.notNull())
        .addColumn('manufacturer_id', 'integer')
        .addColumn('user_id' , 'integer')
        .addColumn('order_datetime', 'datetime')
        .addColumn('status' , 'varchar')
        .addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('deleted_at', 'datetime')
        .addPrimaryKeyConstraint('pk_purchase_order_id', ['id'])
        .addForeignKeyConstraint('fk_manufacturer_id', ['manufacturer_id'], 'manufacturer', ['id'], 
            (col) => col.onUpdate('cascade').onDelete('cascade')
        )
        .addForeignKeyConstraint('fk_user_id', ['user_id'], 'user', ['id'],
            (col) => col.onUpdate('cascade').onDelete('cascade')
        )
        .execute();

    await db.schema
        .createTable('purchase_order_item')
        .addColumn('id', 'integer', (col) => col.notNull())
        .addColumn('purchase_order_id', 'integer')
        .addColumn('item_id', 'integer')
        .addColumn('quantity', 'integer')
        .addPrimaryKeyConstraint('pk_purchase_order_item_id', ['id'])
        .addForeignKeyConstraint('fk_purchase_order_id', ['purchase_order_id'], 'purchase_order', ['id'],
            (col) => col.onUpdate('cascade').onDelete('cascade')
        )
        .execute();

}

export async function down(db: Kysely<any>): Promise<void> {
  
    await db.schema.dropTable('product').execute();
    await db.schema.dropTable('item').execute();
    await db.schema.dropTable('price').execute();
    await db.schema.dropTable('discount').execute();
    await db.schema.dropTable('customization_group').execute();
    await db.schema.dropTable('item_customization').execute();
    await db.schema.dropTable('customization').execute();
    await db.schema.dropTable('purchase_order_item').execute();
    await db.schema.dropTable('purchase_order').execute();
    await db.schema.dropTable('manufacturer').execute();
    await db.schema.dropTable('trade_item_customization').execute();
    await db.schema.dropTable('trade_item').execute();
    await db.schema.dropTable('trade').execute();

}
