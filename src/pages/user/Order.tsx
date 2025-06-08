import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = ['主餐', '飲料', '甜點'] as const;
type Category = typeof categories[number];

type MenuItem = {
  name: string;
  image: string;
  price: number;
  description?: string;
  addons?: { name: string; price: number }[];
};

type CartItem = {
  name: string;
  price: number;
  note?: string;
  addons: { name: string; price: number }[];
  quantity: number;
};

const DUMMY_MENU: Record<Category, MenuItem[]> = {
  主餐: [
    { name: '雞腿便當', image: '/images/test.png', price: 120, description: '附三樣配菜與米飯', addons: [{ name: '加飯', price: 10 }, { name: '加醬', price: 5 }] },
    { name: '排骨飯', image: '/images/test.png', price: 110, description: '酥炸排骨、經典口味', addons: [{ name: '加蛋', price: 15 }, { name: '加辣', price: 0 }] },
    { name: '牛肉燴飯', image: '/images/test.png', price: 130, description: '香濃醬汁，滑嫩牛肉', addons: [{ name: '加蛋', price: 15 }, { name: '不加蔥', price: 0 }] },
    { name: '素食便當', image: '/images/test.png', price: 100, description: '健康素食搭配三樣小菜', addons: [{ name: '加飯', price: 10 }] },
    { name: '咖哩雞飯', image: '/images/test.png', price: 125, description: '濃郁日式咖哩風味', addons: [{ name: '加飯', price: 10 }] },
    { name: '香腸便當', image: '/images/test.png', price: 105, description: '傳統台式香腸搭配時蔬', addons: [{ name: '加蛋', price: 15 }] },
    { name: '魚排飯', image: '/images/test.png', price: 115, description: '酥炸魚排與特製醬汁', addons: [{ name: '加醬', price: 5 }] },
    { name: '三杯雞飯', image: '/images/test.png', price: 130, description: '經典台味三杯雞', addons: [{ name: '加飯', price: 10 }] },
    { name: '滷肉飯', image: '/images/test.png', price: 90, description: '古早味滷肉配飯', addons: [{ name: '加滷蛋', price: 10 }] },
    { name: '燒肉飯', image: '/images/test.png', price: 125, description: '日式燒肉風味，香氣撲鼻', addons: [{ name: '加醬', price: 5 }] }
  ],
  飲料: [
    { name: '紅茶', image: '/images/test.png', price: 30, description: '古早味紅茶', addons: [{ name: '去冰', price: 0 }, { name: '微糖', price: 0 }] },
    { name: '綠茶', image: '/images/test.png', price: 30, description: '清爽綠茶', addons: [{ name: '少冰', price: 0 }, { name: '無糖', price: 0 }] },
    { name: '珍珠奶茶', image: '/images/test.png', price: 50, description: '人氣招牌飲品', addons: [{ name: '半糖', price: 0 }, { name: '珍珠加倍', price: 10 }] },
    { name: '冬瓜檸檬', image: '/images/test.png', price: 35, description: '酸甜清爽，解渴首選', addons: [{ name: '正常冰', price: 0 }] },
    { name: '柳橙汁', image: '/images/test.png', price: 40, description: '新鮮現榨果汁', addons: [{ name: '去冰', price: 0 }] },
    { name: '奶茶', image: '/images/test.png', price: 45, description: '濃郁奶香融合茶香', addons: [{ name: '加奶精', price: 5 }] },
    { name: '可可牛奶', image: '/images/test.png', price: 50, description: '香甜可可飲品', addons: [{ name: '加冰', price: 0 }] },
    { name: '蘋果醋飲', image: '/images/test.png', price: 35, description: '酸甜開胃又健康', addons: [{ name: '去冰', price: 0 }] },
    { name: '抹茶拿鐵', image: '/images/test.png', price: 55, description: '日式抹茶風味', addons: [{ name: '加糖', price: 0 }] },
    { name: '檸檬紅茶', image: '/images/test.png', price: 35, description: '清爽檸檬香氣紅茶', addons: [{ name: '加檸檬片', price: 5 }] }
  ],
  甜點: [
    { name: '布丁', image: '/images/test.png', price: 40, description: '香濃滑順布丁', addons: [{ name: '加焦糖', price: 5 }] },
    { name: '奶酪', image: '/images/test.png', price: 45, description: '濃郁奶香奶酪', addons: [{ name: '加煉乳', price: 5 }] },
    { name: '提拉米蘇', image: '/images/test.png', price: 60, description: '經典義式甜點', addons: [{ name: '加可可粉', price: 5 }] },
    { name: '起司蛋糕', image: '/images/test.png', price: 55, description: '香濃綿密起司風味', addons: [{ name: '加莓果醬', price: 10 }] },
    { name: '抹茶蛋糕', image: '/images/test.png', price: 50, description: '日式抹茶風味', addons: [{ name: '加白玉', price: 10 }] },
    { name: '巧克力蛋糕', image: '/images/test.png', price: 55, description: '濃郁巧克力香氣', addons: [{ name: '加堅果', price: 10 }] },
    { name: '水果塔', image: '/images/test.png', price: 65, description: '新鮮水果與酥脆塔皮', addons: [{ name: '加藍莓', price: 10 }] },
    { name: '馬卡龍', image: '/images/test.png', price: 70, description: '繽紛法式甜點', addons: [{ name: '加餡料', price: 5 }] },
    { name: '冰淇淋', image: '/images/test.png', price: 40, description: '多種口味任選', addons: [{ name: '加醬料', price: 5 }] },
    { name: '泡芙', image: '/images/test.png', price: 45, description: '香酥外皮搭配滑順內餡', addons: [{ name: '加奶油', price: 5 }] }
  ]
};

export default function UserOrderPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('主餐');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [note, setNote] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">手機點餐</h1>

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
          {DUMMY_MENU[category].map((item, idx) => (
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
