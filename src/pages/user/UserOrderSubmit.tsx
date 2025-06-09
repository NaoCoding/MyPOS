// src/pages/user/User_OrderSubmit.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserOrderSubmit() {
  // 保留原版的 navigate
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 pb-20">
      {/* 慶祝動畫背景 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['🎉', '🎊', '✨', '🌟'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes checkmarkAnimation {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
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
          
          .slide-in-up {
            animation: slideInUp 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="relative z-10 text-center w-full max-w-md">
        {/* 成功圖標 */}
        <div 
          className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-2xl mb-8"
          style={{ animation: 'checkmarkAnimation 0.8s ease-out' }}
        >
          <span className="text-5xl">✅</span>
        </div>

        {/* 保留原版的成功訊息 */}
        <div className="slide-in-up text-4xl font-bold text-green-600 mb-4" style={{ animationDelay: '0.2s' }}>
          ✅ 訂單已送出！
        </div>
        
        <div className="slide-in-up text-lg text-gray-700 mb-8" style={{ animationDelay: '0.3s' }}>
          感謝您的點餐，我們將盡快為您準備。
        </div>

        {/* 訂單資訊卡片 */}
        <div className="slide-in-up bg-white rounded-2xl shadow-xl p-6 mb-8" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">訂單狀態</span>
            <span className="font-bold text-green-600 flex items-center gap-2">
              <span>✅</span>
              已確認
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">預計完成時間</span>
            <span className="font-bold text-orange-600">15-20 分鐘</span>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-700">
              <span className="text-xl">📱</span>
              <span className="text-sm">
                訂單準備完成時我們會通知您
              </span>
            </div>
          </div>
        </div>

        {/* 保留原版的按鈕邏輯+美化 */}
        <div className="slide-in-up space-y-4" style={{ animationDelay: '0.5s' }}>
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            onClick={() => navigate('/user/Home')}
          >
            <span className="text-xl">🏠</span>
            返回首頁
          </button>
          
          <button
            className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            onClick={() => navigate('/user/History')}
          >
            <span className="text-xl">📜</span>
            查詢歷史訂單
          </button>

          {/* 額外的繼續點餐按鈕 */}
          <button
            onClick={() => navigate('/user/Order')}
            className="w-full text-gray-500 hover:text-gray-700 py-3 text-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">🍽️</span>
            繼續點餐
          </button>
        </div>

        {/* 特色標籤 */}
        <div className="slide-in-up flex flex-wrap justify-center gap-3 mt-8 opacity-80" style={{ animationDelay: '0.6s' }}>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            ✅ 訂單已確認
          </span>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            📱 即時通知
          </span>
        </div>
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
        <button 
          onClick={() => navigate('/user/History')} 
          className="text-center py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="text-2xl mb-1">📜</div>
          <div className="text-gray-600">紀錄</div>
        </button>
      </nav>
    </div>
  );
}