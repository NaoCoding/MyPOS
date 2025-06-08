import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = ['套餐', '主餐', '副餐', '點心' , '甜品', '飲料', '其他'] as const;
type Category = typeof categories[number];

type MenuItem = {
  id: number; 
  name: string;
  image: string;
  price: number;
  description?: string;
  product_id?: number;
  addons?: { name: string; price: number }[];
  category?: string;
};

interface ApiItem {
  id: number;
  price: number;
  unit_price: number;
  product_id: number;
  addons?: { name: string; price: number }[];
}

interface ApiProduct {
  id: number;
  name: string;
  description?: string;
  category: string;
  image?: string;
}

type CartItem = {
  name: string;
  price: number;
  note?: string;
  addons: { name: string; price: number }[];
  quantity: number;
};

export default function UserOrderPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('主餐');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [note, setNote] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState(1);

  const [menuData, setMenuData] = useState<Record<Category, MenuItem[]>>({} as Record<Category, MenuItem[]>);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const itemResponse = await fetch('http://localhost:5000/item');
        if (!itemResponse.ok) {
          throw new Error(`无法获取菜单项目: ${itemResponse.statusText}`);
        }
        const items: ApiItem[] = await itemResponse.json();

        const productResponse = await fetch('http://localhost:5000/product');
        if (!productResponse.ok) {
          throw new Error(`无法获取产品列表: ${productResponse.statusText}`);
        }
        const products: ApiProduct[] = await productResponse.json();

        console.log("Fetched items:", items);
        console.log("Fetched products:", products);

        const itemsWithProductInfo = items.map((item: ApiItem) => {
          const product = products.find(p => p.id === item.product_id);
          return {
            ...item,
            name: product ? product.name : 'Unknown Item',
            description: product?.description || '',
            category: (product?.category as Category) || '其他',
            image: product?.image || '/images/test.png',
            addons: item.addons || [],
            price: item.unit_price,
          };
        });
        
        
        const groupedItems = itemsWithProductInfo.reduce((acc, item) => {
          const cat = item.category as Category;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {} as Record<Category, MenuItem[]>);
        
        // 确保所有分类都存在
        categories.forEach(cat => {
          if (!groupedItems[cat]) groupedItems[cat] = [];
        });
        
        setMenuData(groupedItems);
      } catch (err) {
        console.error('获取菜单失败:', err);
        setError(err instanceof Error ? err.message : '发生未知错误');
        // 使用空数据作为备用
        setMenuData({} as Record<Category, MenuItem[]>);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);


  const handleAddToCart = () => {
    if (modalItem) {
      const totalAddonPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      const totalPrice = (modalItem.price + totalAddonPrice) * quantity;

      setCart(prev => [...prev, {
        name: modalItem.name,
        price: totalPrice,
        note,
        addons: selectedAddons,
        quantity
      }]);
      setModalItem(null);
      setNote('');
      setSelectedAddons([]);
      setQuantity(1);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = () => {
    alert(`送出訂單：\n${cart.map(i => `${i.name} x${i.quantity}`).join(', ')}\n總金額：$${totalPrice}`);
    setCart([]);
    navigate('/user/Submit');
  };

  console.log("Menu Data:", menuData);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">線上點餐</h1>

        <div className="flex gap-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat}
              className={`flex-1 py-2 rounded ${cat === category ? 'bg-blue-500 text-white' : 'bg-white border'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {menuData[category]?.map((item, idx) => (
            <button
              key={idx}
              className="bg-white border rounded overflow-hidden shadow hover:shadow-lg text-left flex flex-col justify-between"
              onClick={() => setModalItem(item)}
            >
              <div className="w-full aspect-[3/2] bg-gray-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <div className="font-bold text-sm md:text-base">{item.name}</div>
                <div className="text-sm text-gray-600">${item.price}</div>
                {item.description && <div className="text-xs text-gray-500 mt-1">{item.description}</div>}
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">已點項目：</h2>
          {cart.length === 0 ? (
            <div className="text-gray-500">尚未選擇品項</div>
          ) : (
            <ul className="space-y-2">
              {cart.map((item, idx) => (
                <li key={idx} className="bg-white p-2 rounded shadow">
                  <div className="flex justify-between items-center">
                    <div>{item.name} x{item.quantity}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">${item.price}</div>
                      <button onClick={() => handleRemoveFromCart(idx)} className="text-red-500 hover:underline text-sm">刪除</button>
                    </div>
                  </div>
                  {item.addons.length > 0 && <div className="text-sm text-orange-600">加料：{item.addons.map(a => a.name).join(' / ')}</div>}
                  {item.note && <div className="text-sm text-gray-500">備註：{item.note}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded text-lg font-semibold"
          onClick={handleSubmit}
        >
          送出訂單 (${totalPrice})
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-sm z-50">
        <button onClick={() => navigate('/user/Home')} className="text-center">🏠<div>首頁</div></button>
        <button onClick={() => navigate('/user/Order')} className="text-center">🧾<div>點餐</div></button>
        <button onClick={() => navigate('/user/History')} className="text-center">📜<div>紀錄</div></button>
      </nav>

      {modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">{modalItem.name}</h3>
            <img src={modalItem.image} alt={modalItem.name} className="w-full h-48 object-cover rounded mb-2" />
            <p className="text-gray-600 mb-2">{modalItem.description}</p>

            {modalItem.addons && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">選擇加料：</h4>
                <div className="flex flex-wrap gap-2">
                  {modalItem.addons.map((addon, idx) => (
                    <button
                      key={idx}
                      className={`px-2 py-1 border rounded ${selectedAddons.some(a => a.name === addon.name) ? 'bg-yellow-300' : ''}`}
                      onClick={() => setSelectedAddons(prev => prev.some(a => a.name === addon.name) ? prev.filter(a => a.name !== addon.name) : [...prev, addon])}
                    >
                      {addon.name}{addon.price > 0 ? ` (+$${addon.price})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1 font-semibold">備註：</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            <div className="mb-4 flex items-center gap-4">
              <span className="font-semibold">數量：</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalItem(null)} className="px-4 py-2 bg-gray-300 rounded">取消</button>
              <button onClick={handleAddToCart} className="px-4 py-2 bg-blue-500 text-white rounded">加入</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
