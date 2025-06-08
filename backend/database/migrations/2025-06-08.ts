import { sql, Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('product')
        .addColumn('category', 'varchar', (col) =>
            col.defaultTo(null)
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('product')
        .dropColumn('category')
        .execute();
}
