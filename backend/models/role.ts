import { db } from '../database/db';
import { Role } from '../database/schema';

export async function getRoleById(id: number) {
    return await db
        .selectFrom('role')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
}

export async function getUserRole(userId: number) {
    return await db
        .selectFrom('user')
        .where('id', '=', userId)
        .select('role_id')
        .executeTakeFirst();
}
