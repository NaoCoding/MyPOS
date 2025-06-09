// src/data/mockData.ts
// 基於 ER Diagram 的模擬資料

import { 
  MenuCategory, 
  MenuItemWithCustomizations, 
  CustomizationGroup, 
  Customization,
  Item,
  Product 
} from '../types/menu';

// ===== 加料群組資料 =====
const sizeGroup: CustomizationGroup = {
  id: 1,
  name: '尺寸選擇',
  description: '選擇餐點大小',
  is_required: true,
  is_multiple_choice: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  customizations: [
    {
      id: 1,
      customization_group_id: 1,
      name: '小份',
      description: '適合小食量',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      customization_group_id: 1,
      name: '大份',
      description: '份量加大',
      is_available: true,
      price_delta: 20,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]
};

const spicyGroup: CustomizationGroup = {
  id: 2,
  name: '辣度選擇',
  description: '選擇辣度等級',
  is_required: false,
  is_multiple_choice: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  customizations: [
    {
      id: 3,
      customization_group_id: 2,
      name: '不辣',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 4,
      customization_group_id: 2,
      name: '小辣',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 5,
      customization_group_id: 2,
      name: '中辣',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 6,
      customization_group_id: 2,
      name: '大辣',
      is_available: true,
      price_delta: 5,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]
};

const addOnsGroup: CustomizationGroup = {
  id: 3,
  name: '加料選擇',
  description: '可選擇多項加料',
  is_required: false,
  is_multiple_choice: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  customizations: [
    {
      id: 7,
      customization_group_id: 3,
      name: '加蛋',
      is_available: true,
      price_delta: 15,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 8,
      customization_group_id: 3,
      name: '加飯',
      is_available: true,
      price_delta: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 9,
      customization_group_id: 3,
      name: '加起司',
      is_available: true,
      price_delta: 20,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 10,
      customization_group_id: 3,
      name: '加醬料',
      is_available: true,
      price_delta: 5,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]
};

const drinkCustomGroup: CustomizationGroup = {
  id: 4,
  name: '冰塊/甜度',
  description: '飲料客製化選項',
  is_required: false,
  is_multiple_choice: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  customizations: [
    {
      id: 11,
      customization_group_id: 4,
      name: '去冰',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 12,
      customization_group_id: 4,
      name: '少冰',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 13,
      customization_group_id: 4,
      name: '微糖',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 14,
      customization_group_id: 4,
      name: '半糖',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 15,
      customization_group_id: 4,
      name: '無糖',
      is_available: true,
      price_delta: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]
};

// ===== 模擬菜單資料 =====
export const MOCK_MENU: MenuCategory[] = [
  {
    id: 'main-dish',
    name: '主餐',
    items: [
      {
        item: {
          id: 1,
          store_id: 1,
          product_id: 1,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 1,
            name: '雞腿便當',
            description: '附三樣配菜與米飯，營養均衡美味',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [sizeGroup, spicyGroup, addOnsGroup],
        base_price: 120,
        images: ['/images/test.png']
      },
      {
        item: {
          id: 2,
          store_id: 1,
          product_id: 2,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 2,
            name: '排骨飯',
            description: '酥炸排骨，經典口味，香酥可口',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [sizeGroup, spicyGroup, addOnsGroup],
        base_price: 110,
        images: ['/images/test.png']
      },
      {
        item: {
          id: 3,
          store_id: 1,
          product_id: 3,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 3,
            name: '牛肉燴飯',
            description: '香濃醬汁，滑嫩牛肉，口感豐富',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [sizeGroup, spicyGroup, addOnsGroup],
        base_price: 130,
        images: ['/images/test.png']
      },
      {
        item: {
          id: 4,
          store_id: 1,
          product_id: 4,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 4,
            name: '咖哩雞飯',
            description: '濃郁日式咖哩風味，香料豐富',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [sizeGroup, spicyGroup, addOnsGroup],
        base_price: 125,
        images: ['/images/test.png']
      }
    ]
  },
  {
    id: 'drinks',
    name: '飲料',
    items: [
      {
        item: {
          id: 5,
          store_id: 1,
          product_id: 5,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 5,
            name: '珍珠奶茶',
            description: '人氣招牌飲品，Q彈珍珠配濃郁奶茶',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [drinkCustomGroup],
        base_price: 50,
        images: ['/images/test.png']
      },
      {
        item: {
          id: 6,
          store_id: 1,
          product_id: 6,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 6,
            name: '紅茶',
            description: '古早味紅茶，回甘甘甜',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [drinkCustomGroup],
        base_price: 30,
        images: ['/images/test.png']
      },
      {
        item: {
          id: 7,
          store_id: 1,
          product_id: 7,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 7,
            name: '冬瓜檸檬',
            description: '酸甜清爽，解渴首選',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [drinkCustomGroup],
        base_price: 35,
        images: ['/images/test.png']
      }
    ]
  },
  {
    id: 'desserts',
    name: '甜點',
    items: [
      {
        item: {
          id: 8,
          store_id: 1,
          product_id: 8,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 8,
            name: '提拉米蘇',
            description: '經典義式甜點，濃郁咖啡香',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [], // 甜點通常不需要太多客製化
        base_price: 60,
        images: ['/images/test.png']
      },
      {
        item: {
          id: 9,
          store_id: 1,
          product_id: 9,
          quantity: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product: {
            id: 9,
            name: '起司蛋糕',
            description: '香濃綿密起司風味，入口即化',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        },
        customization_groups: [],
        base_price: 55,
        images: ['/images/test.png']
      }
    ]
  }
];

// ===== 工具函數 =====
export const getMenuItemById = (itemId: number): MenuItemWithCustomizations | undefined => {
  for (const category of MOCK_MENU) {
    const item = category.items.find(item => item.item.id === itemId);
    if (item) return item;
  }
  return undefined;
};

export const calculateItemPrice = (
  basePrice: number, 
  selectedCustomizations: { customization_id: number }[]
): number => {
  let totalPrice = basePrice;
  
  for (const selection of selectedCustomizations) {
    for (const category of MOCK_MENU) {
      for (const item of category.items) {
        for (const group of item.customization_groups) {
          const customization = group.customizations?.find(c => c.id === selection.customization_id);
          if (customization) {
            totalPrice += customization.price_delta;
          }
        }
      }
    }
  }
  
  return totalPrice;
};