// src/pages/user/User.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function User_Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 模擬登入過程
    setTimeout(() => {
      setIsLoading(false);
      // 這裡之後會接真實的登入 API
      alert('登入成功！');
      
      // 暫時儲存用戶資訊到 localStorage（模擬登入狀態）
      localStorage.setItem('user', JSON.stringify({
        phone: formData.phone,
        isLoggedIn: true
      }));
      
      navigate('/user/Order');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* 裝飾性背景元素 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-16 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-pink-200 rounded-full opacity-25"></div>
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
          onClick={() => navigate('/user/Home')}
          className="slide-in-up mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          style={{ animationDelay: '0.1s' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首頁
        </button>

        {/* 主要登入卡片 */}
        <div className="slide-in-up bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
          {/* Logo 和標題 */}
          <div className="text-center mb-8">
            <div className="mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">🔐</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              使用者登入
            </h1>
            <p className="text-gray-600">歡迎回來，準備享用美食吧！</p>
          </div>

          {/* 登入表單 */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                    placeholder="請輸入手機號碼"
                    required
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                    placeholder="請輸入密碼"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 登入按鈕 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg'
                }
                text-white shadow-md
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  登入中...
                </div>
              ) : (
                '登入'
              )}
            </button>

            {/* 分隔線 
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>*/}

            {/* 快速體驗按鈕 
            <button
              type="button"
              onClick={() => navigate('/user/Order')}
              className="w-full py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-lg">⚡</span>
              快速體驗點餐
            </button>*/}

            {/* 註冊連結 */}
            <div className="text-center pt-4">
              <span className="text-gray-600">還沒有帳號？</span>
              <button
                type="button"
                onClick={() => navigate('/user/Register')}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                立即註冊
              </button>
            </div>
          </form>
        </div>

        {/* 特色標籤 */}
        <div className="slide-in-up flex flex-wrap justify-center gap-3 mt-6 opacity-80" style={{ animationDelay: '0.4s' }}>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            🔒 安全登入
          </span>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            ⚡ 快速點餐
          </span>
        </div>
      </div>
    </div>
  );
}