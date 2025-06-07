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
    // User related tables
    user: UserTable;
    role: RoleTable;
    permission: PermissionTable;
    role_permission: RolePermissionTable;
    session: SessionTable;

    // Item related tables
    product: ProductTable;
    item: ItemTable;
    price: PriceTable;
    discount: DiscountTable;

    // Customization related tables
    customization_group: CustomizationGroupTable;
    customization: CustomizationTable;
    item_customization_group: ItemCustomizationGroupTable;

    // Trade related tables
    trade: TradeTable;
    trade_item: TradeItemTable;
    trade_item_customization: TradeItemCustomizationTable;

    // Purchase related tables
    manufacturer: ManufacturerTable;
    purchase_order: PurchaseOrderTable;
    purchase_order_item: PurchaseOrderItemTable;
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

// User related types
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

// Item related types
export interface ProductTable {
    id: Generated<number>;
    name: string;
    description: string | null;
}

export interface ItemTable {
    id: Generated<number>;
    product_id: number;
    quantity: number;
}

export interface PriceTable {
    id: Generated<number>;
    item_id: number;
    unit_price: number;
    start_datetime: string | null;
    end_datetime: string | null;
}

export interface DiscountTable {
    id: Generated<number>;
    item_id: number;
    type: string;
    amount: number;
    start_datetime: string | null;
    end_datetime: string | null;
}

// Customization related types
export interface CustomizationGroupTable {
    id: Generated<number>;
    name: string;
    description: string | null;
    is_required: 0 | 1;
    is_multiple_choice: 0 | 1;
}

export interface CustomizationTable {
    id: Generated<number>;
    customization_group_id: number;
    name: string;
    description: string | null;
    is_available: 0 | 1;
    price_delta: number;
}

export interface ItemCustomizationGroupTable {
    id: Generated<number>;
    item_id: number;
    customization_group_id: number;
}

// Trade related types
export interface TradeTable {
    id: Generated<number>;
    user_id: number;
    trade_datetime: string | null;
    status: 'pending' | 'completed';
}

export interface TradeItemTable {
    id: Generated<number>;
    trade_id: number;
    item_id: number;
    quantity: number;
}

export interface TradeItemCustomizationTable {
    trade_item_id: number;
    customization_id: number;
    price_delta_snapshot: number;
}

// Purchase related types
export interface ManufacturerTable {
    id: Generated<number>;
    name: string;
    telephone: string | null;
    address: string | null;
}

export interface PurchaseOrderTable {
    id: Generated<number>;
    manufacturer_id: number;
    user_id: number;
    order_datetime: string | null;
    status: 'pending' | 'completed';
}

export interface PurchaseOrderItemTable {
    id: Generated<number>;
    purchase_order_id: number;
    item_id: number;
    quantity: number;
}

// User related types
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

// Item related types
export type Product = Selectable<ProductTable>;
export type ProductInsert = Insertable<ProductTable>;
export type ProductUpdate = Updateable<ProductTable>;

export type Item = Selectable<ItemTable>;
export type ItemInsert = Insertable<ItemTable>;
export type ItemUpdate = Updateable<ItemTable>;

export type Discount = Selectable<DiscountTable>;
export type DiscountInsert = Insertable<DiscountTable>;
export type DiscountUpdate = Updateable<DiscountTable>;

export type Price = Selectable<PriceTable>;
export type PriceInsert = Insertable<PriceTable>;
export type PriceUpdate = Updateable<PriceTable>;

// Customization related types
export type CustomizationGroup = Selectable<CustomizationGroupTable>;
export type CustomizationGroupInsert = Insertable<CustomizationGroupTable>;
export type CustomizationGroupUpdate = Updateable<CustomizationGroupTable>;

export type Customization = Selectable<CustomizationTable>;
export type CustomizationInsert = Insertable<CustomizationTable>;
export type CustomizationUpdate = Updateable<CustomizationTable>;

export type ItemCustomizationGroup = Selectable<ItemCustomizationGroupTable>;
export type ItemCustomizationGroupInsert = Insertable<ItemCustomizationGroupTable>;
export type ItemCustomizationGroupUpdate = Updateable<ItemCustomizationGroupTable>;

// Trade related types
export type Trade = Selectable<TradeTable>;
export type TradeInsert = Insertable<TradeTable>;
export type TradeUpdate = Updateable<TradeTable>;

export type TradeItem = Selectable<TradeItemTable>;
export type TradeItemInsert = Insertable<TradeItemTable>;
export type TradeItemUpdate = Updateable<TradeItemTable>;

export type TradeItemCustomization = Selectable<TradeItemCustomizationTable>;
export type TradeItemCustomizationInsert = Insertable<TradeItemCustomizationTable>;
export type TradeItemCustomizationUpdate = Updateable<TradeItemCustomizationTable>;

// Purchase related types
export type Manufacturer = Selectable<ManufacturerTable>;
export type ManufacturerInsert = Insertable<ManufacturerTable>;
export type ManufacturerUpdate = Updateable<ManufacturerTable>;

export type PurchaseOrder = Selectable<PurchaseOrderTable>;
export type PurchaseOrderInsert = Insertable<PurchaseOrderTable>;
export type PurchaseOrderUpdate = Updateable<PurchaseOrderTable>;

export type PurchaseOrderItem = Selectable<PurchaseOrderItemTable>;
export type PurchaseOrderItemInsert = Insertable<PurchaseOrderItemTable>;
export type PurchaseOrderItemUpdate = Updateable<PurchaseOrderItemTable>;
