import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserOrderSubmit() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 px-6">
      <div className="text-3xl font-bold text-green-600 mb-4">✅ 訂單已送出！</div>
      <div className="text-lg text-gray-700 mb-8">感謝您的點餐，我們將盡快為您準備。</div>

      <button
        className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white text-xl py-3 rounded-lg mb-4"
        onClick={() => navigate('/user/Home')}
      >
        返回首頁
      </button>

      <button
        className="w-full max-w-xs bg-gray-400 hover:bg-gray-500 text-white text-xl py-3 rounded-lg"
        onClick={() => navigate('/user/History')}
      >
        查詢歷史訂單
      </button>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-sm z-50">
        <button onClick={() => navigate('/user/Home')} className="text-center">🏠<div>首頁</div></button>
        <button onClick={() => navigate('/user/Order')} className="text-center">🧾<div>點餐</div></button>
        <button onClick={() => navigate('/user/History')} className="text-center">📜<div>紀錄</div></button>
      </nav>
    </div>
    
  );
}
