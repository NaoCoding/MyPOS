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
    discount: DiscountTable;
    item: ItemTable;
    user: UserTable;
    price: PriceTable;
    product: ProductTable;
    session: SessionTable;
}

export interface DiscountTable {
    id: Generated<number>;
    item_id: number;
    type: string;
    amount: number;
    start_datetime: string | null;
    end_datetime: string | null;
    created_at: createdAtColumn;
    deleted_at: deletedAtColumn;
}

export interface ItemTable {
    id: Generated<number>;
    product_id: number;
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

export interface PriceTable {
    id: Generated<number>;
    item_id: number;
    unit_price: number;
    start_datetime: string | null;
    end_datetime: string | null;
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

export type Discount = Selectable<DiscountTable>;
export type DiscountInsert = Insertable<DiscountTable>;
export type DiscountUpdate = Updateable<DiscountTable>;

export type Item = Selectable<ItemTable>;
export type ItemInsert = Insertable<ItemTable>;
export type ItemUpdate = Updateable<ItemTable>;

export type User = Selectable<UserTable>;
export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Price = Selectable<PriceTable>;
export type PriceInsert = Insertable<PriceTable>;
export type PriceUpdate = Updateable<PriceTable>;

export type Product = Selectable<ProductTable>;
export type ProductInsert = Insertable<ProductTable>;
export type ProductUpdate = Updateable<ProductTable>;

export type Session = Selectable<SessionTable>;
export type SessionInsert = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
