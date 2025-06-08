import React, { useState } from 'react';

interface SaleItem {
  name: string;
  unitPrice: number;
  quantity: number;
}

export default function ShiftReport() {
  const [note, setNote] = useState('');

  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const sales: SaleItem[] = [
    { name: '雞腿便當', unitPrice: 120, quantity: 10 },
    { name: '排骨便當', unitPrice: 110, quantity: 6 },
    { name: '素食便當', unitPrice: 100, quantity: 3 },
  ];

  const total = sales.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleSubmit = () => {
    alert(`交班成功！備註：${note}\n總營業額：$${total}`);
    // 可改為 fetch('/api/shifts', { method: 'POST', body: JSON.stringify(...) })
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md mt-10 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">今日交班表</h1>

      <div className="mb-4">
        <p><strong>日期：</strong>{today}</p>
        <p><strong>交班時間：</strong>{new Date().toLocaleTimeString()}</p>
      </div>

      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">商品名稱</th>
            <th className="border px-4 py-2 text-right">單價</th>
            <th className="border px-4 py-2 text-right">數量</th>
            <th className="border px-4 py-2 text-right">總金額</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2 text-right">${item.unitPrice}</td>
              <td className="border px-4 py-2 text-right">{item.quantity}</td>
              <td className="border px-4 py-2 text-right">${item.unitPrice * item.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-100">
            <td className="border px-4 py-2" colSpan={3}>總營業額</td>
            <td className="border px-4 py-2 text-right">${total}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mb-4">
        <label className="block mb-1 font-medium">備註：</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="例如：找零金額、備貨情況、特殊事件..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="text-right">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          確認交班
        </button>
      </div>
    </div>
  );
}
