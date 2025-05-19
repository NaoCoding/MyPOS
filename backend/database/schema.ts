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
    item: ItemTable;
    user: UserTable;
    product: ProductTable;
    session: SessionTable;
    store: StoreTable;
}

export interface ItemTable {
    id: Generated<number>;
    product_id: number;
    store_id: number;
    quantity: number;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
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

export interface ProductTable {
    id: Generated<number>;
    name: string;
    description: string | null;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
}

export interface SessionTable {
    id: Generated<number>;
    user_id: number;
    token: string;
    expired_at: string;
}

export interface StoreTable {
    id: Generated<number>;
    name: string;
    address: string;
    telephone: string;
    open_time: string;
    close_time: string;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
}

export type Item = Selectable<ItemTable>;
export type ItemInsert = Insertable<ItemTable>;
export type ItemUpdate = Updateable<ItemTable>;

export type User = Selectable<UserTable>;
export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Product = Selectable<ProductTable>;
export type ProductInsert = Insertable<ProductTable>;
export type ProductUpdate = Updateable<ProductTable>;

export type Session = Selectable<SessionTable>;
export type SessionInsert = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;

export type Store = Selectable<StoreTable>;
export type StoreInsert = Insertable<StoreTable>;
export type StoreUpdate = Updateable<StoreTable>;
