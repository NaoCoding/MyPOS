// src/pages/user/User_OrderHistory.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backendAPI = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';
interface Customization {
  name: string;
}

interface TradeItem {
  name: string;
  quantity: number;
  customizations: Customization[];
}

interface Trade {
  id: number;
  total_price: number;
  trade_datetime: string;
  trade_items: TradeItem[];
}

export default function UserOrderHistory() {
  // 保留原版的狀態管理
  const navigate = useNavigate();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendAPI}/trade/my`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setTrades(data);
    }
    catch (error) {
      console.error('Error fetching trades:', error);
      setTrades([]);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchTrades();
  }, []);

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
        {/* 訂單結果 */}
        {trades.length === 0 ? (
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
                {trades.length} 筆訂單
              </div>
            </div>

            {trades.map((trade, i) => (
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
                      <span className="text-sm">訂購時間：{ new Date(trade.trade_datetime).toLocaleString() }</span>
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
                      {trade.trade_items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                          <span>
                            {item.name} * {item.quantity}
                            （{item.customizations.length > 0
                              ? item.customizations.map((c, idx) => c.name).join('、')
                              : '無額外選項'}）
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 總金額和操作 */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-2xl font-bold text-green-600">
                    ${trade.total_price}
                  </div>
                  {/* <button
                    onClick={() => {
                      alert(`重新訂購：${trade.items.join('、')}`);
                      navigate('/user/Order');
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🔄</span>
                    重新訂購
                  </button> */}
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