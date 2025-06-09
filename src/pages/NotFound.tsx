import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen  text-white px-6">
      {/* 加入圖片 */}
      <img
        src="/images/404.png"
        alt="404 Not Found"
        className="w-[500px] mb-6 rounded-lg shadow-lg"
      />

      <p className="text-2xl mb-2 font-semibold text-gray-300">找不到這個頁面</p>
      <p className="text-gray-400 mb-6">請確認網址是否正確，或返回首頁</p>

      <button
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-full shadow-md transition-all"
        onClick={() => navigate('/')}
      >
        返回首頁
      </button>
    </div>
  );
}
