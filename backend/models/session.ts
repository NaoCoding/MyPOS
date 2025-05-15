import { db } from '../database/db';
import { Session, SessionInsert, SessionUpdate } from '../database/schema';

export async function createSession(session: SessionInsert) {
    return await db
        .insertInto('session')
        .values(session)
        .executeTakeFirstOrThrow();
}

export async function updateSession(session: SessionUpdate) {
    if (!session.user_id || !session.token || !session.expired_at) {
        throw new Error('Session must have user_id, token and expired_at');
    }

    return await db
        .updateTable('session')
        .set(session)
        .where('user_id', '=', session.user_id)
        .executeTakeFirstOrThrow();
}

export async function findSession(session: Partial<Session>) {
    let query = db.selectFrom('session');

    if (session.id) {
        query = query.where('session.id', '=', session.id);
    }

    if (session.user_id) {
        query = query.where('session.user_id', '=', session.user_id);
    }

    if (session.token) {
        query = query.where('session.token', '=', session.token);
    }

    return await query.selectAll().executeTakeFirst();
}

export async function createOrUpdateSession(session: SessionInsert) {
    const existingSession = await findSession({ user_id: session.user_id });

    if (existingSession) {
        return await updateSession(session);
    } else {
        return await createSession(session);
    }
}
