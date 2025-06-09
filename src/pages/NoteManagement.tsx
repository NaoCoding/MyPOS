import React, { useEffect, useState } from 'react';

interface Customization {
  id: number;
  name: string;
  customization_group_name: string;
  is_available: boolean;
}

export default function NoteSettings() {
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCustomization, setNewCustomization] = useState({
    name: '',
    customization_group_name: '加價選項' as Customization['customization_group_name'],
  });

  const fetchCustomizations = async () => {
    try {
      setLoading(true);
      const backendURL = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';
      const customizations = await fetch(`${backendURL}/customization`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!customizations.ok) {
        console.log("HTTP error:", customizations.status, await customizations.json());
        throw new Error(`HTTP error! status: ${customizations.status}`);
      }

      const data = await customizations.json();
      setCustomizations(data);
    }
    catch (error) {
      console.error('取得自訂選項時發生錯誤:', error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const handleAdd = () => {
    if (!newCustomization.name.trim()) {
      alert('請輸入備註內容');
      return;
    }
    const next: Customization = {
      id: customizations.length + 1,
      name: newCustomization.name.trim(),
      customization_group_name: newCustomization.customization_group_name,
      is_available: true,
    };
    setCustomizations(prev => [...prev, next]);
    setNewCustomization({ name: '', customization_group_name: '加價選項' });
  };

  const toggleEnable = (id: number) => {
    setCustomizations(prev =>
      prev.map(n => n.id === id ? { ...n, is_available: !n.is_available } : n)
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('確定要刪除這筆備註嗎？')) {
      setCustomizations(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">備註管理</h1>

      {/* 📋 備註清單 */}
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">備註內容</th>
            <th className="border px-4 py-2 text-left">類型</th>
            <th className="border px-4 py-2 text-center">狀態</th>
            <th className="border px-4 py-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {customizations.map(note => (
            <tr key={note.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{note.name}</td>
              <td className="border px-4 py-2">{note.customization_group_name}</td>
              <td className="border px-4 py-2 text-center">
                <span className={note.is_available ? 'text-green-600' : 'text-gray-500'}>
                  {note.is_available ? '啟用中' : '停用'}
                </span>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => toggleEnable(note.id)}
                >
                  {note.is_available ? '停用' : '啟用'}
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(note.id)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ➕ 新增備註 */}
      <div className="bg-gray-50 border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">新增備註</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="備註內容（如：加飯）"
            className="border p-2 rounded flex-1"
            value={newCustomization.name}
            onChange={(e) => setNewCustomization({ ...newCustomization, name: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newCustomization.customization_group_name}
            onChange={(e) => setNewCustomization({ ...newCustomization, customization_group_name: e.target.value as Customization['customization_group_name'] })}
          >
            <option value="加價選項">加價選項</option>
            <option value="備註標記">備註標記</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAdd}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}
