import React, { useState, useEffect } from 'react';

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  reorderAmount: number;
  warningLevel: number;
  category: string;
}

const DUMMY_DATA: InventoryItem[] = [
  { id: 1, name: '雞腿便當', stock: 30, reorderAmount: 50, warningLevel: 20, category: '主餐' },
  { id: 2, name: '排骨便當', stock: 10, reorderAmount: 50, warningLevel: 15, category: '主餐' },
  { id: 3, name: '紅茶', stock: 100, reorderAmount: 100, warningLevel: 50, category: '飲料' },
  { id: 4, name: '味增湯', stock: 5, reorderAmount: 20, warningLevel: 10, category: '湯品' },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    stock: '',
    reorderAmount: '',
    warningLevel: '',
    category: '主餐',
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('全部');

  const categories = ['主餐', '飲料', '配菜', '湯品'];

  useEffect(() => {
    setItems(DUMMY_DATA);
  }, []);

  const handleAdd = () => {
    const { name, stock, reorderAmount, warningLevel, category } = newItem;
    if (!name || !stock || !reorderAmount || !warningLevel) return alert('請填寫所有欄位');

    const item: InventoryItem = {
      id: Date.now(),
      name,
      stock: parseInt(stock),
      reorderAmount: parseInt(reorderAmount),
      warningLevel: parseInt(warningLevel),
      category,
    };
    setItems(prev => [...prev, item]);
    setNewItem({ name: '', stock: '', reorderAmount: '', warningLevel: '', category: '主餐' });
  };

  const handleStockChange = (id: number, newStock: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
  };

  const filtered = items.filter(i =>
    (filter === '全部' || i.category === filter) &&
    i.name.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">📦 庫存管理</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input type="text" placeholder="搜尋商品" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded flex-1 min-w-[200px]" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="全部">全部分類</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">匯出 CSV</button>
      </div>

      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">商品名稱</th>
            <th className="border px-4 py-2">分類</th>
            <th className="border px-4 py-2 text-right">庫存</th>
            <th className="border px-4 py-2 text-right">補貨數量</th>
            <th className="border px-4 py-2 text-right">警戒下限</th>
            <th className="border px-4 py-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className={item.stock < item.warningLevel ? 'bg-red-50' : ''}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2 text-right">{item.stock}</td>
              <td className="border px-4 py-2 text-right">{item.reorderAmount}</td>
              <td className="border px-4 py-2 text-right">{item.warningLevel}</td>
              <td className="border px-4 py-2 text-right">
                <button onClick={() => handleStockChange(item.id, item.stock + item.reorderAmount)} className="text-blue-600 hover:underline mr-2">補貨</button>
                <button onClick={() => handleStockChange(item.id, 0)} className="text-red-600 hover:underline">清空</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-gray-50 border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">➕ 新增商品至庫存</h2>
        <div className="grid grid-cols-5 gap-4">
          <input type="text" placeholder="商品名稱" className="border p-2 rounded" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <input type="number" placeholder="初始庫存" className="border p-2 rounded" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} />
          <input type="number" placeholder="預設補貨" className="border p-2 rounded" value={newItem.reorderAmount} onChange={(e) => setNewItem({ ...newItem, reorderAmount: e.target.value })} />
          <input type="number" placeholder="警戒下限" className="border p-2 rounded" value={newItem.warningLevel} onChange={(e) => setNewItem({ ...newItem, warningLevel: e.target.value })} />
          <select className="border p-2 rounded" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
            {categories.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="text-right mt-4">
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">新增商品</button>
        </div>
      </div>
    </div>
  );
}
