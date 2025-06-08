import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function User_Home() {
  const navigate = useNavigate();
  const naughtyBtnRef = useRef<HTMLButtonElement>(null);

  const escapeButton = () => {
    const btn = naughtyBtnRef.current;
    if (btn) {
      const container = btn.parentElement;
      const maxX = container!.clientWidth - btn.offsetWidth;
      const maxY = container!.clientHeight - btn.offsetHeight;
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      btn.style.position = 'absolute';
      btn.style.left = `${newX}px`;
      btn.style.top = `${newY}px`;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-orange-50 px-6 overflow-hidden">
      <style>
        {`
          @keyframes pulseScale {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
        `}
      </style>

      <h1
        className="text-3xl font-bold mb-8 text-orange-600"
        style={{
          animation: 'pulseScale 2.5s ease-in-out infinite',
        }}
      >
        歡迎使用 MyPOS 點餐系統
      </h1>

      <button
        className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white text-xl py-4 rounded-lg mb-4"
        onClick={() => navigate('/user/CustomerInfo')}
      >
        我要點餐
      </button>

      <button
        className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white text-xl py-4 rounded-lg mb-4"
        onClick={() => navigate('/user/History')}
      >
        查詢歷史訂單
      </button>

      <button
        className="w-full max-w-xs bg-gray-400 hover:bg-gray-500 text-white text-xl py-4 rounded-lg"
        onClick={() => alert('請洽服務人員')}
      >
        聯絡我們
      </button>

      {/* 調皮按鈕 */}
      <button
        ref={naughtyBtnRef}
        onMouseEnter={escapeButton}
        className="bg-red-500 text-white text-sm px-3 py-2 rounded-lg font-semibold shadow absolute"
        style={{ top: '80%' }}
      >
        點我拿優惠券！
      </button>
    </div>
  );
}
