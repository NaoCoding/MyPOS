import { sql, Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {

    await db.schema
        .alterTable('purchase_order_item')
        .addColumn('price', 'decimal', (col) => 
            col.notNull().defaultTo(0)  
        )
        .execute();

}


export async function down(db: Kysely<any>): Promise<void> {

    await db.schema
        .alterTable('purchase_order_item')
        .dropColumn('price')
        .execute();

}