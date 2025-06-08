import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mobile_CustomerInfo() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (!name || !phone) {
      alert('請輸入完整顧客資料');
      return;
    }
    // 將顧客資訊傳到下一頁（可擴充為 context 或後端儲存）
    navigate('/Mobile/Order', { state: { name, phone } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">請輸入您的資料</h2>

      <input
        className="w-full max-w-sm border rounded px-4 py-2 mb-4 text-lg"
        placeholder="姓名"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-full max-w-sm border rounded px-4 py-2 mb-6 text-lg"
        placeholder="電話"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <button
        className="w-full max-w-sm bg-green-500 hover:bg-green-600 text-white text-xl py-3 rounded"
        onClick={handleNext}
      >
        下一步
      </button>
    </div>
  );
}
