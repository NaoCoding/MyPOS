import React, { useState } from 'react';

interface ReportItem {
  name: string;
  quantity: number;
  revenue: number;
}

export default function DailyReport() {
  const todayStr = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
  const [date, setDate] = useState(todayStr);
  const [note, setNote] = useState('');

  // 模擬資料，可從後端 fetch
  const data: ReportItem[] = [
    { name: '雞腿便當', quantity: 20, revenue: 2400 },
    { name: '排骨便當', quantity: 15, revenue: 1650 },
    { name: '素食便當', quantity: 5, revenue: 500 },
  ];

  const totalRevenue = data.reduce((sum, i) => sum + i.revenue, 0);
  const totalQuantity = data.reduce((sum, i) => sum + i.quantity, 0);
  const avgOrderValue = totalRevenue / data.length;

  return (
    <div className="max-w-5xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-4">日報表</h1>

      {/* 日期選擇 */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium">查詢日期：</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* 營收總覽 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">總銷售額</p>
          <p className="text-xl font-bold text-blue-700">${totalRevenue}</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">總售出數量</p>
          <p className="text-xl font-bold text-green-700">{totalQuantity}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">平均每品項營收</p>
          <p className="text-xl font-bold text-yellow-700">${avgOrderValue.toFixed(0)}</p>
        </div>
      </div>

      {/* 明細表格 */}
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">商品名稱</th>
            <th className="border px-4 py-2 text-right">售出數量</th>
            <th className="border px-4 py-2 text-right">營收</th>
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
        <label className="block mb-1 font-medium">備註：</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="例如：今天下雨影響人流、下午店員交班提早..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* 匯出按鈕（待接功能） */}
      <div className="text-right">
        <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
          匯出報表（未實作）
        </button>
      </div>
    </div>
  );
}
