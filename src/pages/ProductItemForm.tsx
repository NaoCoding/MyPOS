// src/pages/ProductItemList.tsx
import React, { useState } from 'react';

interface ItemRow {
  id: number;
  name: string;
  store: string;
  price: number;
  quantity: number;
  discount: string;
  customizations: string[];
}

const DUMMY_ITEMS: ItemRow[] = [
  {
    id: 1,
    name: '雞腿便當',
    store: '台北店',
    price: 120,
    quantity: 50,
    discount: '9折',
    customizations: ['加飯', '不加蔥'],
  },
  {
    id: 2,
    name: '排骨便當',
    store: '台中店',
    price: 110,
    quantity: 30,
    discount: '無',
    customizations: ['加辣'],
  },
];

export default function ProductItemList() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    store: '',
    price: '',
    quantity: '',
    discount: '',
    customizations: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">商品品項總表</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded shadow">+ 新增品項</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border border-gray-300 px-4 py-2">商品編號</th>
              <th className="border border-gray-300 px-4 py-2">商品名稱</th>
              <th className="border border-gray-300 px-4 py-2">店鋪</th>
              <th className="border border-gray-300 px-4 py-2">價格</th>
              <th className="border border-gray-300 px-4 py-2">數量</th>
              <th className="border border-gray-300 px-4 py-2">折扣</th>
              <th className="border border-gray-300 px-4 py-2">加價選項</th>
              <th className="border border-gray-300 px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_ITEMS.map((item) => (
              <tr key={item.id} className="text-center hover:bg-gray-50 transition">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.store}</td>
                <td className="border border-gray-300 px-4 py-2">${item.price}</td>
                <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{item.discount}</td>
                <td className="border border-gray-300 px-4 py-2">{item.customizations.join(' / ')}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2">編輯</button>
                  <button className="text-red-600 hover:underline">刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-[90%] max-w-xl">
            <h2 className="text-xl font-bold mb-4">新增商品品項</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="商品名稱" className="border p-2 rounded" onChange={handleChange} />
              <input name="store" placeholder="店鋪" className="border p-2 rounded" onChange={handleChange} />
              <input type="number" name="price" placeholder="價格" className="border p-2 rounded" onChange={handleChange} />
              <input type="number" name="quantity" placeholder="數量" className="border p-2 rounded" onChange={handleChange} />
              <input name="discount" placeholder="折扣" className="border p-2 rounded col-span-2" onChange={handleChange} />
              <input name="customizations" placeholder="加價選項（以 / 分隔）" className="border p-2 rounded col-span-2" onChange={handleChange} />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={() => setShowModal(false)}>取消</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">送出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
