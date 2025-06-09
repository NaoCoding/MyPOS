// 基於 ER Diagram 的完整 TypeScript 介面定義

// ===== 基礎商品類型 =====
export interface Product {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: number;
  store_id: number;
  product_id: number;
  discount_id?: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  // 關聯資料
  product?: Product;
  current_price?: number;
  images?: string[];
}

// ===== 加料系統類型 =====
export interface CustomizationGroup {
  id: number;
  name: string;
  description?: string;
  is_required: boolean;        // 必選群組
  is_multiple_choice: boolean; // 多選 vs 單選
  created_at: string;
  updated_at: string;
  // 關聯的加料選項
  customizations?: Customization[];
}

export interface Customization {
  id: number;
  customization_group_id: number;
  name: string;
  description?: string;
  is_available: boolean;
  price_delta: number;  // 加價金額 (可以是負數表示折扣)
  created_at: string;
  updated_at: string;
}

export interface ItemCustomization {
  item_id: number;
  customization_group_id: number;
  price_delta: number;  // 覆寫預設加價
  created_at: string;
  updated_at: string;
}

// ===== 完整商品資料 (包含加料選項) =====
export interface MenuItemWithCustomizations {
  item: Item;
  customization_groups: CustomizationGroup[];
  base_price: number;
  images: string[];
}

// ===== 訂單相關類型 =====
export interface SelectedCustomization {
  customization_id: number;
  customization: Customization;
  price_delta: number;
}

export interface CartItem {
  item_id: number;
  item_name: string;
  base_price: number;
  quantity: number;
  note?: string;
  selected_customizations: SelectedCustomization[];
  total_price: number;  // (base_price + sum(customizations)) * quantity
}

export interface Trade {
  id?: number;
  user_id: number;
  trade_status_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface TradeItem {
  id?: number;
  trade_id: number;
  item_id: number;
  quantity: number;
  unit_price_snapshot: number;
  discount_snapshot: number;
  created_at?: string;
  updated_at?: string;
}

export interface TradeItemCustomization {
  trade_item_id: number;
  customization_id: number;
  price_delta_snapshot: number;
  created_at?: string;
  updated_at?: string;
}

// ===== 前端 UI 專用類型 =====
export interface CustomizationGroupUI extends CustomizationGroup {
  selectedCustomizations: number[];  // 已選中的 customization IDs
  error?: string;  // 必選群組未選擇時的錯誤訊息
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItemWithCustomizations[];
}

// ===== API 回應類型 =====
export interface MenuResponse {
  categories: MenuCategory[];
  total_items: number;
}

export interface CustomizationResponse {
  item_id: number;
  customization_groups: CustomizationGroup[];
}

export interface PriceCalculationRequest {
  item_id: number;
  quantity: number;
  selected_customizations: {
    customization_id: number;
    quantity?: number;
  }[];
}

export interface PriceCalculationResponse {
  base_price: number;
  customization_total: number;
  final_price: number;
  breakdown: {
    customization_id: number;
    name: string;
    price_delta: number;
    quantity: number;
  }[];
}