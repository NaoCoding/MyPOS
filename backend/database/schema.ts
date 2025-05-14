import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely';

type createdAtColumn = ColumnType<Date, never, never>;
type deletedAtColumn = ColumnType<Date | null, never, Date | null>;

export interface Database {
    user: UserTable;
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

export type User = Selectable<UserTable>;
export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
