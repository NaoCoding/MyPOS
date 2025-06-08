import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mobile_Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name || !phone || !password) {
      alert('請填寫所有欄位');
      return;
    }
    alert(`註冊成功！\n姓名：${name}\n手機：${phone}`);
    navigate('/Mobile/Home');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 px-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">使用者註冊</h1>

      <input
        className="w-full max-w-sm border rounded px-4 py-2 mb-4 text-lg"
        placeholder="姓名"
        value={name}
        onChange={e => setName(e.target.value)}
      />
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
        className="w-full max-w-sm bg-green-500 hover:bg-green-600 text-white text-xl py-3 rounded"
        onClick={handleRegister}
      >
        註冊
      </button>
    </div>
  );
}
