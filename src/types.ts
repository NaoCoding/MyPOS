export interface MenuItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  category: string;
  customization_groups: [{
    customizations:[{id: number, name:string}]
  }
  ];
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes: string[];
  addons?: string[];
}
