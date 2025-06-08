import React, { useState, useEffect } from 'react'; // useEffect 新增
import OrderTypeSelector from '../components/OrderTypeSelector';
import CategoryColumn from '../components/CategoryColumn';
import MenuGrid from '../components/MenuGrid';
import SharedNotes from '../components/SharedNotes';
import FooterActionBar from '../components/FooterActionBar';
import CartSidebar from '../components/CartSidebar';
import { CartItem, MenuItem } from '../types';

const categories = ['套餐', '主餐', '副餐', '點心', '甜品' , '飲料' , '其他'] as const;
type Category = typeof categories[number];

const DUMMY_NOTE_OPTIONS = [
  '無糖','少糖','半糖','七分糖','全糖','去冰','微冰','少冰','多冰', '不加蔥', '不加蒜'
];

const ADDON_OPTIONS = ['加蛋', '加飯', '加醬', '加辣', '加肉'];

export default function OrderPage() {
  const [orderType, setOrderType] = useState<string>('內用');
  const [category, setCategory] = useState<Category>('套餐');
  const [sharedNotes, setSharedNotes] = useState<string[]>(['', '']);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // CartItem 應已包含 notes 和 addons
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // 新增狀態來儲存從後端獲取的菜單項目
  const [menuData, setMenuData] = useState<Record<Category, MenuItem[]>>({} as Record<Category, MenuItem[]>);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  // 從後端獲取菜單項目
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoadingMenu(true);
        setMenuError(null);
        // 假設您的後端 API 端點是 /api/menu-items
        const response = await fetch('http://localhost:5000/item');
        if (!response.ok) {
          throw new Error(`無法獲取菜單項目: ${response.statusText}`);
        }
        const itemsFromBackend: MenuItem[] = await response.json();
        const productResponse = await fetch('http://localhost:5000/product');
        if (!productResponse.ok) {
          throw new Error(`無法獲取產品列表: ${productResponse.statusText}`);
        }
        const products: { id: number; name: string; category: string}[] = await productResponse.json();
        // 將菜單項目與產品列表進行關聯
        const itemsWithProductNames = await itemsFromBackend.map(item => {
          const product = products.find(p => p.id === item.product_id);
          return {
            ...item,
            name: product ? `${product.name}` : item.name, // 如果有產品名稱，則添加到菜單項目名稱中
            category: product ? product.category as Category : "未分類", // 確保 category 是 Category 類型
          };
        });

        console.log("獲取的菜單項目:", itemsWithProductNames);

        // 將獲取的項目按分類分組
        const groupedItems = itemsWithProductNames.reduce((acc, item) => {
          const itemCategory = item.category as Category;
          console.log(`處理項目: ${item.name}, 分類: ${itemCategory}`);
          if (categories.includes(itemCategory)) {
            if (!acc[itemCategory]) {
              acc[itemCategory] = [];
            }
            acc[itemCategory].push(item);
          }
          else{
            if(!acc['其他']) {
              acc['其他'] = [];
            }
            acc['其他'].push(item); // 將未分類的項目放入 '其他' 分類
          }
          return acc;
        }, {} as Record<Category, MenuItem[]>);

        // 確保所有定義的分類都存在於 menuData 中，即使是空陣列
        categories.forEach(cat => {
          if (!groupedItems[cat]) {
            groupedItems[cat] = [];
          }
        });
        setMenuData(groupedItems);
      } catch (error) {
        console.error("獲取菜單項目失敗:", error);
        setMenuError(error instanceof Error ? error.message : "發生未知錯誤");
        // 可選擇設定一個預設的空菜單或顯示錯誤訊息
        const emptyMenu = categories.reduce((acc, cat) => {
          acc[cat] = [];
          return acc;
        }, {} as Record<Category, MenuItem[]>);
        setMenuData(emptyMenu);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddItem = (item: MenuItem) => {
    setCartItems(prev => {
      const found = prev.find(i => i.id === item.id);
      if (found) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      // 確保新加入購物車的項目包含 price, notes 和 addons
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

  // 新增：處理訂單提交的函數
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("購物車是空的！");
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderPayload = {
      orderType,
      items: cartItems.map(item => ({
        menuItemId: item.id, // 後端可能需要的是 menuItemId
        quantity: item.quantity,
        priceAtOrder: item.price, // 記錄下單時的價格
        notes: item.notes,
        addons: item.addons || [],
      })),
      sharedNotes,
      totalAmount,
      // 您可能還需要其他資訊，如顧客ID、桌號等
    };

    try {
      // 假設您的後端 API 端點是 /api/orders
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 如果您的API需要身份驗證，請在此處加入 token
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(orderPayload),
        credentials: 'include', // 如果使用 httpOnly cookies 進行身份驗證
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `訂單提交失敗: ${response.statusText}`);
      }

      const result = await response.json();
      alert(`訂單已成功送出！訂單編號: ${result.orderId}`); // 假設後端返回 orderId
      setCartItems([]); // 清空購物車
      setSharedNotes(['', '']);
      // 可選擇導向到訂單成功頁面或重置其他狀態
    } catch (error) {
      console.error("提交訂單失敗:", error);
      alert(error instanceof Error ? error.message : "發生未知錯誤");
    }
  };
  
  if (isLoadingMenu) {
    return <div className="flex justify-center items-center h-screen">載入菜單中...</div>;
  }

  if (menuError) {
    return <div className="flex justify-center items-center h-screen text-red-500">錯誤: {menuError}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <OrderTypeSelector value={orderType} onChange={setOrderType} />
      <div className="flex flex-1">
        <CategoryColumn categories={categories} onSelect={handleSelectCategory} />
        <div className="flex-1 bg-gray-100 p-2">
          {/* 使用 menuData 而不是 DUMMY_ITEMS */}
          <MenuGrid items={menuData[category]} onAdd={handleAddItem} />

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
      {/* 將 handlePlaceOrder 函數傳遞給 FooterActionBar */}
      <FooterActionBar />
    </div>
  );
}


