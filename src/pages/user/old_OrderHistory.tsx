import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface Order {
  time: string;
  items: string[];
  total: number;  
}


export default function UserOrderHistory() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const handleSearch = async () => {
    // 模擬 API 回傳結果
    const mockData: Order[] = [
      { time: '2024-06-01 12:30', items: ['雞腿便當', '紅茶'], total: 150 },
      { time: '2024-06-03 18:45', items: ['排骨飯', '綠茶', '布丁'], total: 185 },
    ];

    setOrders(mockData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 px-6">
      <h1 className="text-2xl font-bold mb-4">查詢歷史訂單</h1>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-sm z-50">
        <button onClick={() => navigate('/user/Home')} className="text-center">🏠<div>首頁</div></button>
        <button onClick={() => navigate('/user/Order')} className="text-center">🧾<div>點餐</div></button>
        <button onClick={() => navigate('/user/History')} className="text-center">📜<div>紀錄</div></button>
      </nav>
      <div className="w-full max-w-sm flex flex-col items-center">
        <input
          type="text"
          placeholder="輸入手機號碼"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          查詢
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-gray-500">尚無訂單紀錄</div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <div className="font-semibold text-sm">訂購時間：{order.time}</div>
              <div className="text-sm mt-1 text-gray-700">內容：{order.items.join(', ')}</div>
              <div className="text-sm mt-1 text-green-700 font-semibold">總金額：${order.total}</div>
            </li>

          ))}
        </ul>
      )}
      
    </div>
  );
}
