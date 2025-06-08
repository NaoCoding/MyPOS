import React, { useState } from 'react';
import OrderTypeSelector from '../components/OrderTypeSelector';
import CategoryColumn from '../components/CategoryColumn';
import MenuGrid from '../components/MenuGrid';
import SharedNotes from '../components/SharedNotes';
import FooterActionBar from '../components/FooterActionBar';
import CartSidebar from '../components/CartSidebar';
import { CartItem, MenuItem } from '../types';

const categories = ['套餐', '主餐', '副餐', '點心', '甜品'] as const;
type Category = typeof categories[number];

const DUMMY_ITEMS: Record<Category, MenuItem[]> = {
  套餐: [
    { id: 1, name: '雞腿便當' },
    { id: 2, name: '排骨便當' },
    { id: 3, name: '牛腩便當' },
    { id: 4, name: '鯖魚便當' },
    { id: 5, name: '咖哩雞便當' },
    { id: 6, name: '雞排便當' },
    { id: 7, name: '炸蝦便當' },
    { id: 8, name: '素食便當' },
    { id: 9, name: '滷肉便當' },
    { id: 10, name: '三杯雞便當' },
  ],
  主餐: [
    { id: 11, name: '燒肉飯' },
    { id: 12, name: '魚排飯' },
    { id: 13, name: '雞排飯' },
    { id: 14, name: '牛肉燴飯' },
    { id: 15, name: '打拋豬飯' },
    { id: 16, name: '糖醋雞丁飯' },
    { id: 17, name: '蔥爆牛飯' },
    { id: 18, name: '日式炸豬排飯' },
    { id: 19, name: '咖哩豬飯' },
    { id: 20, name: '宮保雞丁飯' },
  ],
  副餐: [
    { id: 21, name: '滷蛋' },
    { id: 22, name: '豆干' },
    { id: 23, name: '小熱狗' },
    { id: 24, name: '炸豆腐' },
    { id: 25, name: '百頁豆腐' },
    { id: 26, name: '海帶絲' },
    { id: 27, name: '炒青菜' },
    { id: 28, name: '高麗菜' },
    { id: 29, name: '玉米粒' },
    { id: 30, name: '滷花生' },
  ],
  點心: [
    { id: 31, name: '春捲' },
    { id: 32, name: '炸雞塊' },
    { id: 33, name: '炸水餃' },
    { id: 34, name: '脆薯' },
    { id: 35, name: '洋蔥圈' },
    { id: 36, name: '甜不辣' },
    { id: 37, name: '黑輪片' },
    { id: 38, name: '糯米腸' },
    { id: 39, name: '花枝丸' },
    { id: 40, name: '香腸' },
  ],
  甜品: [
    { id: 41, name: '布丁' },
    { id: 42, name: '豆花' },
    { id: 43, name: '仙草凍' },
    { id: 44, name: '紅豆湯' },
    { id: 45, name: '芋圓冰' },
    { id: 46, name: '黑糖粉粿' },
    { id: 47, name: '愛玉' },
    { id: 48, name: '冰淇淋球' },
    { id: 49, name: '綠豆湯' },
    { id: 50, name: '抹茶奶酪' },
  ]
};


const DUMMY_NOTE_OPTIONS = [
  '無糖','少糖','半糖','七分糖','全糖','去冰','微冰','少冰','多冰', '不加蔥', '不加蒜'
];

const ADDON_OPTIONS = ['加蛋', '加飯', '加醬', '加辣', '加肉'];

export default function OrderPage() {
  const [orderType, setOrderType] = useState<string>('內用');
  const [category, setCategory] = useState<Category>('套餐');
  const [sharedNotes, setSharedNotes] = useState<string[]>(['', '']);
  const [cartItems, setCartItems] = useState<(CartItem & { notes: string[]; addons?: string[] })[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleAddItem = (item: MenuItem) => {
    setCartItems(prev => {
      const found = prev.find(i => i.id === item.id);
      if (found) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, notes: [], addons: [] }];
    });
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(i.quantity - 1, 0) } : i));
  };

  const handleIncrementItem = (id: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const handleSelectCategory = (selected: string) => {
    if (categories.includes(selected as Category)) {
      setCategory(selected as Category);
    }
  };

  const handleToggleNote = (note: string) => {
    if (selectedItemId === null) return;
    setCartItems(prev => prev.map(item => {
      if (item.id !== selectedItemId) return item;
      const hasNote = item.notes.includes(note);
      const newNotes = hasNote ? item.notes.filter(n => n !== note) : [...item.notes, note];
      return { ...item, notes: newNotes };
    }));
  };

  const handleToggleAddon = (addon: string) => {
    if (selectedItemId === null) return;
    setCartItems(prev => prev.map(item => {
      if (item.id !== selectedItemId) return item;
      const currentAddons = item.addons || [];
      const hasAddon = currentAddons.includes(addon);
      const newAddons = hasAddon ? currentAddons.filter(a => a !== addon) : [...currentAddons, addon];
      return { ...item, addons: newAddons };
    }));
  };

  const selectedItem = cartItems.find(i => i.id === selectedItemId);

  return (
    <div className="flex flex-col h-screen">
      <OrderTypeSelector value={orderType} onChange={setOrderType} />
      <div className="flex flex-1">
        <CategoryColumn categories={categories} onSelect={handleSelectCategory} />
        <div className="flex-1 bg-gray-100 p-2">
          <MenuGrid items={DUMMY_ITEMS[category]} onAdd={handleAddItem} />

          <div className="grid grid-cols-5 gap-2 mb-2">
            {DUMMY_NOTE_OPTIONS.map((note, index) => {
              const isSelected = selectedItem?.notes.includes(note);
              return (
                <button
                  key={index}
                  disabled={!selectedItem}
                  onClick={() => handleToggleNote(note)}
                  className={`
                    p-2 rounded border 
                    ${isSelected ? 'bg-green-200 ring-2 ring-green-500' : 'bg-green-100 hover:bg-green-200'} 
                    ${!selectedItem ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {note}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <div className="font-semibold text-sm mb-1">加料：</div>
            <div className="grid grid-cols-5 gap-2">
              {ADDON_OPTIONS.map((addon, index) => {
                const isSelected = selectedItem?.addons?.includes(addon);
                return (
                  <button
                    key={index}
                    disabled={!selectedItem}
                    onClick={() => handleToggleAddon(addon)}
                    className={`p-2 rounded border text-sm ${isSelected ? 'bg-yellow-300 ring-2 ring-yellow-500' : 'bg-yellow-100 hover:bg-yellow-200'} ${!selectedItem ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {addon}
                  </button>
                );
              })}
            </div>
          </div>

          <SharedNotes notes={sharedNotes} setNotes={setSharedNotes} />
        </div>
        <CartSidebar
          items={cartItems}
          onAdd={handleIncrementItem}
          onRemove={handleRemoveItem}
          onSelect={setSelectedItemId}
          selectedId={selectedItemId}
          sharedNotes={sharedNotes}
        />
      </div>
      <FooterActionBar />
    </div>
  );
}
