import { db } from '../database/db';
import { User, UserInsert, UserUpdate } from '../database/schema';

export async function createUser(user: UserInsert) {
    return await db
        .insertInto('user')
        .values(user)
        .executeTakeFirstOrThrow();
}

export async function getUsers() {
    return await db
        .selectFrom('user')
        .selectAll()
        .execute();
}

export async function findUser(data: Partial<User>) {
    let query = db.selectFrom('user');

    if (data.id) {
        query = query.where('user.id', '=', data.id);
    }

    if (data.username) {
        query = query.where('user.username', '=', data.username);
    }

    if (data.email) {
        query = query.where('user.email', '=', data.email);
    }

    if (data.telephone) {
        query = query.where('user.telephone', '=', data.telephone);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function findUserSession(data: Partial<User>) {
    let query = db.selectFrom('user').innerJoin('session', 'user.id', 'session.user_id');

    if (data.id) {
        query = query.where('user.id', '=', data.id);
    }

    if (data.username) {
        query = query.where('user.username', '=', data.username);
    }

    if (data.email) {
        query = query.where('user.email', '=', data.email);
    }

    if (data.telephone) {
        query = query.where('user.telephone', '=', data.telephone);
    }

    return await query.select([
        'user.id', 'user.username', 'session.token', 'session.expired_at',
    ]).executeTakeFirst();
}
