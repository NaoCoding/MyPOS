import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mobile_Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!phone || !password) {
      alert('請輸入手機與密碼');
      return;
    }

    // 模擬登入驗證（實際應串接後端）
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('查無此帳號，請先註冊');
      return;
    }

    const parsed = JSON.parse(storedUser);
    if (parsed.phone === phone && parsed.password === password) {
      alert('登入成功');
      navigate('/Mobile/CustomerInfo'); // 成功導向點餐前個人資訊頁
    } else {
      alert('帳號或密碼錯誤');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">使用者登入</h2>

      <input
        className="w-full max-w-sm border rounded px-4 py-2 mb-4 text-lg"
        placeholder="手機號碼"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <input
        type="password"
        className="w-full max-w-sm border rounded px-4 py-2 mb-6 text-lg"
        placeholder="密碼"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        className="w-full max-w-sm bg-blue-500 hover:bg-blue-600 text-white text-xl py-3 rounded mb-4"
        onClick={handleLogin}
      >
        登入
      </button>

      <button
        className="text-blue-600 hover:underline text-sm"
        onClick={() => navigate('/Mobile/Register')}
      >
        還沒有帳號？去註冊
      </button>
    </div>
  );
}
