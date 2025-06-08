import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function CustomerAnalysis() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  // 假資料
  const stats = {
    totalCustomers: 120,
    averageSpending: 250,
    returnRate: 42,
  };

  const hourData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${i + 9}時`,
    count: Math.floor(Math.random() * 20 + 10),
  }));

  const genderData = [
    { name: '男性', value: 60 },
    { name: '女性', value: 40 },
  ];

  const memberData = [
    { name: '會員', value: 80 },
    { name: '非會員', value: 40 },
  ];

  const topItems = [
    { name: '雞腿便當', count: 35 },
    { name: '排骨便當', count: 28 },
    { name: '蔬食便當', count: 19 },
  ];

  const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">客群分析</h1>

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

      {/* 整體統計 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">顧客總人數</p>
          <p className="text-xl font-bold text-blue-700">{stats.totalCustomers} 位</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">平均消費金額</p>
          <p className="text-xl font-bold text-green-700">${stats.averageSpending}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow">
          <p className="text-sm text-gray-600">回訪率</p>
          <p className="text-xl font-bold text-yellow-700">{stats.returnRate}%</p>
        </div>
      </div>

      {/* 消費時段分析 */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">📈 消費時段分析</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 客群分布分析 */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div>
          <h2 className="text-lg font-semibold mb-2">👫 性別分布</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80} label>
                {genderData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">🧑‍💼 會員分布</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={memberData} dataKey="value" nameKey="name" outerRadius={80} label>
                {memberData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 熱門品項 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">🏆 熱門商品排行</h2>
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">商品名稱</th>
              <th className="border px-4 py-2 text-right">銷售數量</th>
            </tr>
          </thead>
          <tbody>
            {topItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2 text-right">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
