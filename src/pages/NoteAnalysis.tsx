import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

interface NoteStat {
  label: string;
  count: number;
}

export default function NoteAnalysis() {
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const [date, setDate] = useState(today);

  // 假資料：可改為後端 fetch 回傳
  const noteStats: NoteStat[] = [
    { label: '加飯', count: 42 },
    { label: '不加辣', count: 30 },
    { label: '加辣', count: 27 },
    { label: '不加蔥', count: 15 },
    { label: '素食', count: 5 },
  ];

  const totalCount = noteStats.reduce((sum, note) => sum + note.count, 0);

  return (
    <div className="max-w-5xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">備註分析</h1>

      {/* 日期選擇 */}
      <div className="mb-6">
        <label className="font-medium mr-2">查詢日期：</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* 備註統計表 */}
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">備註</th>
            <th className="border px-4 py-2 text-right">使用次數</th>
            <th className="border px-4 py-2 text-right">占比</th>
          </tr>
        </thead>
        <tbody>
          {noteStats.map((note, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{note.label}</td>
              <td className="border px-4 py-2 text-right">{note.count}</td>
              <td className="border px-4 py-2 text-right">
                {((note.count / totalCount) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 條狀圖 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">備註使用排行圖</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={noteStats} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 備註 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">🏆 Top 3 備註</h2>
        <ol className="list-decimal list-inside text-blue-700">
          {noteStats.slice(0, 3).map((note, idx) => (
            <li key={idx}>
              {note.label}（{note.count} 次，{((note.count / totalCount) * 100).toFixed(1)}%）
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
