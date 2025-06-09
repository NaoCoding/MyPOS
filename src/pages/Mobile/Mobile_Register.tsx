// src/pages/Mobile/Mobile_Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mobile_Register() {
  // 保留原版的狀態管理
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 保留原版的註冊邏輯
  const handleRegister = () => {
    if (!name || !phone || !password) {
      alert('請填寫所有欄位');
      return;
    }
    alert(`註冊成功！\n姓名：${name}\n手機：${phone}`);
    navigate('/Mobile/Home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* 裝飾性背景元素 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-16 w-24 h-24 bg-pink-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 left-8 w-16 h-16 bg-blue-200 rounded-full opacity-25"></div>
      </div>

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
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .slide-in-up {
            animation: slideInUp 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="relative z-10 w-full max-w-md">
        {/* 返回按鈕 */}
        <button
          onClick={() => navigate('/Mobile/Home')}
          className="slide-in-up mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          style={{ animationDelay: '0.1s' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首頁
        </button>

        {/* 主要註冊卡片 */}
        <div className="slide-in-up bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
          {/* Logo 和標題 */}
          <div className="text-center mb-8">
            <div className="mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">👤</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              使用者註冊
            </h1>
            <p className="text-gray-600">加入我們，開始您的美食之旅！</p>
          </div>

          {/* 註冊表單 - 保留原版邏輯 */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="請輸入您的姓名"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手機號碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📱</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="請輸入手機號碼"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔒</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="請輸入密碼"
                />
              </div>
            </div>

            {/* 註冊按鈕 - 保留原版邏輯 */}
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md mt-6"
            >
              註冊
            </button>

            {/* 登入連結 */}
            <div className="text-center pt-4">
              <span className="text-gray-600">已經有帳號了？</span>
              <button
                type="button"
                onClick={() => navigate('/Mobile/Login')}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                立即登入
              </button>
            </div>
          </div>
        </div>

        {/* 特色標籤 */}
        <div className="slide-in-up flex flex-wrap justify-center gap-3 mt-6 opacity-80" style={{ animationDelay: '0.4s' }}>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
            🎉 免費註冊
          </span>
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
            🍽️ 立即點餐
          </span>
        </div>
      </div>
    </div>
  );
}