import React, { useState } from 'react';

interface Note {
  id: number;
  label: string;
  type: '加價選項' | '備註標記';
  enabled: boolean;
}

export default function NoteSettings() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, label: '加飯', type: '加價選項', enabled: true },
    { id: 2, label: '不加辣', type: '備註標記', enabled: true },
    { id: 3, label: '蛋奶素', type: '備註標記', enabled: false },
  ]);

  const [newNote, setNewNote] = useState({
    label: '',
    type: '加價選項' as Note['type'],
  });

  const handleAdd = () => {
    if (!newNote.label.trim()) {
      alert('請輸入備註內容');
      return;
    }
    const next: Note = {
      id: notes.length + 1,
      label: newNote.label.trim(),
      type: newNote.type,
      enabled: true,
    };
    setNotes(prev => [...prev, next]);
    setNewNote({ label: '', type: '加價選項' });
  };

  const toggleEnable = (id: number) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('確定要刪除這筆備註嗎？')) {
      setNotes(prev => prev.filter(n => n.id !== id));
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
          {notes.map(note => (
            <tr key={note.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{note.label}</td>
              <td className="border px-4 py-2">{note.type}</td>
              <td className="border px-4 py-2 text-center">
                <span className={note.enabled ? 'text-green-600' : 'text-gray-500'}>
                  {note.enabled ? '啟用中' : '停用'}
                </span>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => toggleEnable(note.id)}
                >
                  {note.enabled ? '停用' : '啟用'}
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
            value={newNote.label}
            onChange={(e) => setNewNote({ ...newNote, label: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newNote.type}
            onChange={(e) => setNewNote({ ...newNote, type: e.target.value as Note['type'] })}
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
