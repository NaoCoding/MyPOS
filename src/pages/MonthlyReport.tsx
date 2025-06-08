import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

interface MonthlyItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
}

export default function MonthlyReport() {
  const currentMonth = new Date().toISOString().slice(0, 7); // yyyy-mm
  const [month, setMonth] = useState(currentMonth);
  const [note, setNote] = useState('');

  const data: MonthlyItem[] = [
    { name: '雞腿便當', quantity: 220, revenue: 26400 },
    { name: '排骨便當', quantity: 180, revenue: 19800 },
    { name: '素食便當', quantity: 75, revenue: 7500 },
  ];

  const dailyRevenueData: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}日`,
    revenue: Math.floor(Math.random() * 2000) + 1000, // 模擬每日營收
  }));

  const totalRevenue = data.reduce((sum, i) => sum + i.revenue, 0);
  const totalQuantity = data.reduce((sum, i) => sum + i.quantity, 0);
  const avgPerDay = totalRevenue / 30;

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-4">月報表</h1>

      {/* 月份選擇 */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium">查詢月份：</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* 概要 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">本月總銷售額</p>
          <p className="text-xl font-bold text-blue-700">${totalRevenue}</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">總售出數量</p>
          <p className="text-xl font-bold text-green-700">{totalQuantity}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">平均每日營收</p>
          <p className="text-xl font-bold text-yellow-700">${avgPerDay.toFixed(0)}</p>
        </div>
      </div>

      {/* 📈 趨勢圖 */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">每日營收趨勢圖</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 明細表格 */}
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">商品名稱</th>
            <th className="border px-4 py-2 text-right">總售出數量</th>
            <th className="border px-4 py-2 text-right">總營收</th>
            <th className="border px-4 py-2 text-right">營收占比</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2 text-right">{item.quantity}</td>
              <td className="border px-4 py-2 text-right">${item.revenue}</td>
              <td className="border px-4 py-2 text-right">
                {((item.revenue / totalRevenue) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 備註 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">營運備註：</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="例如：行銷活動帶動營收、週末人潮特別多..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* 匯出報表按鈕 */}
      <div className="text-right">
        <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
          匯出月報表（未實作）
        </button>
      </div>
    </div>
  );
}
