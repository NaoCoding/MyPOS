// src/pages/user/User_OrderHistory.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 保留原版的介面定義
interface Order {
  time: string;
  items: string[];
  total: number;
}

export default function UserOrderHistory() {
  // 保留原版的狀態管理
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();


  // 保留原版的查詢邏輯
  const handleSearch = async () => {
    // 模擬 API 回傳結果
    const mockData: Order[] = [
      { time: '2024-06-01 12:30', items: ['雞腿便當', '紅茶'], total: 150 },
      { time: '2024-06-03 18:45', items: ['排骨飯', '綠茶', '布丁'], total: 185 },
    ];
    setOrders(mockData);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/user/Home')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
            <h1 className="text-2xl font-bold text-gray-800">查詢歷史訂單</h1>
            <div className="w-12"></div> {/* 占位符 */}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 查詢區塊 - 保留原版邏輯 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
              <span className="text-2xl font-bold text-white">📱</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">手機號碼查詢</h2>
            <p className="text-gray-600">輸入您的手機號碼查詢訂單記錄</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">📱</span>
              </div>
              <input
                type="text"
                placeholder="輸入手機號碼"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform shadow-lg"
            >
              🔍 查詢訂單
            </button>
          </div>
        </div>

        {/* 訂單結果 */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg mb-2">尚無訂單紀錄</p>
            <p className="text-gray-400 text-sm mb-6">輸入手機號碼查詢您的訂單歷史</p>
            <button
              onClick={() => navigate('/user/Order')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              立即點餐
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">查詢結果</h3>
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {orders.length} 筆訂單
              </div>
            </div>

            {orders.map((order, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 transform hover:scale-105"
                style={{
                  animation: `slideInUp 0.6s ease-out ${i * 0.1}s both`
                }}
              >
                {/* 訂購時間 */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-lg text-gray-800">訂單 #{i + 1}</div>
                    <div className="text-gray-500 flex items-center gap-2">
                      <span className="text-sm">🕐</span>
                      <span className="text-sm">訂購時間：{order.time}</span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    已完成
                  </div>
                </div>

                {/* 訂單內容 */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span>🍽️</span>
                    訂購內容：
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-gray-700">
                      {order.items.join('、')}
                    </div>
                  </div>
                </div>

                {/* 總金額和操作 */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-2xl font-bold text-green-600">
                    ${order.total}
                  </div>
                  <button
                    onClick={() => {
                      alert(`重新訂購：${order.items.join('、')}`);
                      navigate('/user/Order');
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🔄</span>
                    重新訂購
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 保留原版的底部導航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-3 text-sm z-50">
        <button 
          onClick={() => navigate('/user/Home')} 
          className="text-center py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="text-2xl mb-1">🏠</div>
          <div className="text-gray-600">首頁</div>
        </button>
        <button 
          onClick={() => navigate('/user/Order')} 
          className="text-center py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="text-2xl mb-1">🧾</div>
          <div className="text-gray-600">點餐</div>
        </button>
        <button className="text-center py-2 px-4 rounded-lg bg-blue-50 text-blue-600">
          <div className="text-2xl mb-1">📜</div>
          <div className="font-medium">紀錄</div>
        </button>
      </nav>

      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </div>
  );
}