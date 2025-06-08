// src/pages/OrderManagement.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

interface Order {
  id: number;
  date: string;
  items: OrderItem[];
  total: number;
}

const DUMMY_ORDERS: Order[] = [
  {
    id: 101,
    date: '2025-05-31',
    items: [
      { name: '雞腿便當', quantity: 2, notes: '不加蔥' },
      { name: '排骨便當', quantity: 1 },
    ],
    total: 350,
  },
  {
    id: 102,
    date: '2025-05-30',
    items: [
      { name: '燒肉飯', quantity: 3 },
    ],
    total: 300,
  },
];

export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-1/3 bg-blue-100 p-4 border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4">
          {selectedOrder ? `訂單編號：${selectedOrder.id}` : '請選擇訂單'}
        </h2>
        {selectedOrder && selectedOrder.items.map((item, idx) => (
          <div key={idx} className="bg-yellow-100 p-2 mb-2 rounded shadow-sm">
            <div>{item.name}</div>
            <div className="text-sm text-gray-600">數量：{item.quantity}</div>
            {item.notes && <div className="text-sm text-gray-600">備註：{item.notes}</div>}
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-6 bg-white overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">歷史訂單列表</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/Checkout')}
          >
            返回點餐
          </button>
        </div>
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border border-gray-300 px-4 py-2">訂單編號</th>
              <th className="border border-gray-300 px-4 py-2">訂單日期</th>
              <th className="border border-gray-300 px-4 py-2">商品數量</th>
              <th className="border border-gray-300 px-4 py-2">總金額</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_ORDERS.map(order => (
              <tr
                key={order.id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{order.date}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{order.items.length}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
