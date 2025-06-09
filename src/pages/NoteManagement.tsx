import React, { useState } from 'react';

interface Customization {
  id: number;
  name: string;
  groupName: '加價選項' | '備註標記';
  is_available: boolean;
  price_delta: number;
}

export default function NoteSettings() {
  const [customizations, setCustomizations] = useState<Customization[]>([
    {
      id: 1,
      name: '加飯',
      groupName: '加價選項',
      is_available: true,
      price_delta: 10,
    },
    {
      id: 2,
      name: '不加辣',
      groupName: '備註標記',
      is_available: true,
      price_delta: 0,
    },
    {
      id: 3,
      name: '蛋奶素',
      groupName: '備註標記',
      is_available: false,
      price_delta: 0,
    },
  ]);

  const [newNote, setNewNote] = useState({
    name: '',
    groupName: '加價選項' as Customization['groupName'],
    price_delta: 0,
  });

  const handleAdd = () => {
    if (!newNote.name.trim()) {
      alert('請輸入備註內容');
      return;
    }
    const next: Customization = {
      id: customizations.length + 1,
      name: newNote.name.trim(),
      groupName: newNote.groupName,
      is_available: true,
      price_delta: newNote.groupName === '加價選項' ? newNote.price_delta : 0,
    };
    setCustomizations(prev => [...prev, next]);
    setNewNote({ name: '', groupName: '加價選項', price_delta: 0 });
  };

  const toggleAvailable = (id: number) => {
    setCustomizations(prev =>
      prev.map(n =>
        n.id === id ? { ...n, is_available: !n.is_available } : n
      )
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

      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">備註內容</th>
            <th className="border px-4 py-2 text-left">類型</th>
            <th className="border px-4 py-2 text-right">加價</th>
            <th className="border px-4 py-2 text-center">狀態</th>
            <th className="border px-4 py-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {customizations.map(note => (
            <tr key={note.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{note.name}</td>
              <td className="border px-4 py-2">{note.groupName}</td>
              <td className="border px-4 py-2 text-right">{note.price_delta}</td>
              <td className="border px-4 py-2 text-center">
                <span className={note.is_available ? 'text-green-600' : 'text-gray-500'}>
                  {note.is_available ? '啟用中' : '停用'}
                </span>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => toggleAvailable(note.id)}
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
            value={newNote.name}
            onChange={(e) => setNewNote({ ...newNote, name: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newNote.groupName}
            onChange={(e) => setNewNote({ ...newNote, groupName: e.target.value as Customization['groupName'] })}
          >
            <option value="加價選項">加價選項</option>
            <option value="備註標記">備註標記</option>
          </select>
          {newNote.groupName === '加價選項' && (
            <input
              type="number"
              className="border p-2 rounded w-28"
              placeholder="加價"
              value={newNote.price_delta}
              onChange={(e) => setNewNote({ ...newNote, price_delta: parseFloat(e.target.value) || 0 })}
            />
          )}
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
