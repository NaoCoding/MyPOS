import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface ProductStat {
  name: string;
  quantity: number;
  revenue: number;
  profit: number;
  category: string;
}

const mockData: ProductStat[] = [
  { name: '雞腿便當', quantity: 120, revenue: 14400, profit: 4200, category: '主餐' },
  { name: '排骨便當', quantity: 90, revenue: 9900, profit: 2800, category: '主餐' },
  { name: '蔬菜便當', quantity: 60, revenue: 6600, profit: 1900, category: '主餐' },
  { name: '可樂', quantity: 150, revenue: 4500, profit: 2200, category: '飲料' },
  { name: '味噌湯', quantity: 80, revenue: 1600, profit: 1000, category: '湯品' },
  { name: '炸豆腐', quantity: 50, revenue: 2500, profit: 1500, category: '配菜' },
];

const colorMap = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function SalesRanking() {
  const [metric, setMetric] = useState<'quantity' | 'revenue' | 'profit'>('quantity');
  const [categoryFilter, setCategoryFilter] = useState<'全部' | '主餐' | '飲料' | '配菜' | '湯品'>('全部');
  const [search, setSearch] = useState('');

  const filtered = mockData
    .filter(p => categoryFilter === '全部' || p.category === categoryFilter)
    .filter(p => p.name.includes(search))
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 10);

  const total = filtered.reduce((sum, p) => sum + p[metric], 0);

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">銷售排行分析</h1>

      {/* 查詢工具列 */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select className="border p-2 rounded" value={metric} onChange={e => setMetric(e.target.value as any)}>
          <option value="quantity">依銷售量排行</option>
          <option value="revenue">依營收排行</option>
          <option value="profit">依毛利排行</option>
        </select>
        <select className="border p-2 rounded" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)}>
          <option value="全部">全部分類</option>
          <option value="主餐">主餐</option>
          <option value="飲料">飲料</option>
          <option value="配菜">配菜</option>
          <option value="湯品">湯品</option>
        </select>
        <input
          type="text"
          placeholder="搜尋商品"
          className="border p-2 rounded flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">匯出報表</button>
      </div>

      {/* 條狀圖 */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">📊 前 10 銷售商品（{metric === 'quantity' ? '銷量' : metric === 'revenue' ? '營收' : '毛利'}）</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filtered} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey={metric} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 圓餅圖 */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">📈 占比分析</h2>
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                data={filtered}
                dataKey={metric}
                nameKey="name"
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                {filtered.map((_, i) => (
                    <Cell key={i} fill={colorMap[i % colorMap.length]} />
                ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
            </ResponsiveContainer>

      </div>

      {/* 表格 */}
      <h2 className="text-lg font-semibold mb-2">📦 銷售明細</h2>
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">商品名稱</th>
            <th className="border px-4 py-2 text-right">分類</th>
            <th className="border px-4 py-2 text-right">銷售量</th>
            <th className="border px-4 py-2 text-right">營收</th>
            <th className="border px-4 py-2 text-right">毛利</th>
            <th className="border px-4 py-2 text-right">占比</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2 text-right">{p.category}</td>
              <td className="border px-4 py-2 text-right">{p.quantity}</td>
              <td className="border px-4 py-2 text-right">${p.revenue}</td>
              <td className="border px-4 py-2 text-right">${p.profit}</td>
              <td className="border px-4 py-2 text-right">
                {((p[metric] / total) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
