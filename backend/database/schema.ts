import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely';

type createdAtColumn = ColumnType<string, never, never>;
type deletedAtColumn = ColumnType<string | null, never, string | null>;

export interface Database {
    user: UserTable;
    session: SessionTable;
}

export interface UserTable {
    id: Generated<number>;
    username: string;
    email: string;
    telephone: string;
    password: string;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
}

export interface SessionTable {
    id: Generated<number>;
    user_id: number;
    token: string;
    expired_at: string;
}

export type User = Selectable<UserTable>;
export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Session = Selectable<SessionTable>;
export type SessionInsert = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
