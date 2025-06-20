// src/pages/user/User_Home.tsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const backendAPI = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';

export default function UserHome() {
  const navigate = useNavigate();
  const naughtyBtnRef = useRef<HTMLButtonElement>(null);

  const escapeButton = () => {
    const btn = naughtyBtnRef.current;
    if (btn) {
      const container = btn.offsetParent as HTMLElement;
      if (!container) return;

      const margin = 20;
      const containerRect = container.getBoundingClientRect();
      const maxX = container.clientWidth - btn.offsetWidth - margin;
      const maxY = container.clientHeight - btn.offsetHeight - margin;
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;

      btn.style.transition = 'top 0.2s ease-out, left 0.2s ease-out';
      btn.style.left = `${newX}px`;
      btn.style.top = `${newY}px`;
    }
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 px-6 overflow-hidden">
      {/* 裝飾性背景元素 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-16 w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-green-200 rounded-full opacity-25"></div>
        <div className="absolute bottom-1/4 left-6 w-20 h-20 bg-purple-200 rounded-full opacity-20"></div>
      </div>

      <style>
        {`
          @keyframes pulseScale {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
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

      {/* 主要內容 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8">
        {/* Logo 和標題 */}
        <div className="text-center mb-12">
          <div className="mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">🍽️</span>
            </div>
          </div>

          <h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent"
            style={{ animation: 'pulseScale 2.5s ease-in-out infinite' }}
          >
            MyPOS!!!! 點餐系統
          </h1>

          <p className="text-gray-600 text-lg">美味餐點，輕鬆點選 ✨</p>
        </div>

        {/* 主要功能按鈕（含聯絡我們） */}
        <div className="w-full max-w-sm space-y-4 mb-8">
          <button
            className="slide-in-up w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl py-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            onClick={() => navigate('/user/order')}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-2xl">🛒</span>
            我要點餐
          </button>

          <button
            className="slide-in-up w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xl py-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            onClick={() => navigate('/user/History')}
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-2xl">📜</span>
            查詢歷史訂單
          </button>

          <button
            className="slide-in-up w-full bg-white hover:bg-gray-50 text-gray-700 text-lg py-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200"
            onClick={() => alert('請洽服務人員')}
            style={{ animationDelay: '0.3s' }}
          >
            <span className="text-xl">📞</span>
            聯絡我們
          </button>

          <button
            className="slide-in-up w-full bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white text-lg py-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            onClick={() => {
              // 登出後導回登入頁
              fetch(backendAPI+'/logout', {
                method: 'POST',
                credentials: 'include',
              }).then(() => {
                window.location.href = '/login';
              });
            }}
            style={{ animationDelay: '0.4s' }}
          >
            <span className="text-xl">🚪</span>
            登出
          </button>
        </div>

        {/* 特色標籤 */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 opacity-80">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            ✨ 新版加料系統
          </span>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            🚀 智慧價格計算
          </span>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
            📱 手機優化
          </span>
        </div>

        {/* 調皮按鈕 */}
        <button
          ref={naughtyBtnRef}
          onMouseEnter={escapeButton}
          onClick={escapeButton}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg transition-all duration-300"
          style={{
            position: 'absolute',
            left: 'calc(100% - 160px)',
            top: '550px',
            animation: 'pulseScale 2s ease-in-out infinite',
          }}
        >
          🎁 點我拿優惠券！
        </button>
      </div>


      

    </div>
  );
}