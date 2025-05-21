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
    role_id: number;
    email: string;
    telephone: string;
    password: string;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
}

export interface RoleTable {
    id: Generated<number>;
    name: string;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
    updated_at: createdAtColumn;
}

export interface PermissionTable {
    id: Generated<number>;
    name: string;
    description: string;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
    updated_at: createdAtColumn;
}

export interface RolePermissionTable {
    role_id: number;
    permission_id: number;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
    updated_at: createdAtColumn;
}

export interface SessionTable {
    id: Generated<number>;
    user_id: number;
    token: string;
    expired_at: string;
}

export type Role = Selectable<RoleTable>;
export type RoleInsert = Insertable<RoleTable>;
export type RoleUpdate = Updateable<RoleTable>;

export type Permission = Selectable<PermissionTable>;
export type PermissionInsert = Insertable<PermissionTable>;
export type PermissionUpdate = Updateable<PermissionTable>;

export type RolePermission = Selectable<RolePermissionTable>;
export type RolePermissionInsert = Insertable<RolePermissionTable>;
export type RolePermissionUpdate = Updateable<RolePermissionTable>;

export type User = Selectable<UserTable>;
export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Session = Selectable<SessionTable>;
export type SessionInsert = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
