export interface MenuItem {
  id: number;
  name: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
