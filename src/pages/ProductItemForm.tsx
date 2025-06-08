// src/pages/ProductItemForm.tsx
import React, { useState , useEffect } from 'react';

interface ItemRow {
  id: number;
  name: string;
  description: string;
  category: string;
}

export default function ProductItemList() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true); // 開始載入前設置 loading
      const response = await fetch('http://localhost:5000/product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.log("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as ItemRow[];
      setItems(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error("Failed to fetch items:", e);
      // 保留範例資料作為備案，或根據需求移除
      setItems([
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('請填寫商品名稱、店鋪、價格與數量');
      return;
    }

    const newItemPayload = formData
    //console.log(newItemPayload)

    try {
      const response = await fetch('http://localhost:5000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItemPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setShowModal(false);
      fetchItems(); // 重新獲取商品列表
      alert('商品新增成功！');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        alert(`新增商品失敗: ${err.message}`);
      } else {
        setError('新增商品時發生未知錯誤');
        alert('新增商品時發生未知錯誤');
      }
      console.error("Failed to submit item:", err);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('確定要刪除此商品嗎？')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/item/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // 有些 DELETE API 可能回傳 204 No Content，沒有 JSON body
      // const data = await response.json(); 
      // console.log('Delete success:', data);

      alert('商品刪除成功！');
      fetchItems(); // 重新獲取商品列表
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        alert(`刪除商品失敗: ${err.message}`);
      } else {
        setError('刪除商品時發生未知錯誤');
        alert('刪除商品時發生未知錯誤');
      }
      console.error(`Failed to delete item ${itemId}:`, err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">商品品項總表</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded shadow"
        >
          + 新增品項
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border border-gray-300 px-4 py-2">商品編號</th>
              <th className="border border-gray-300 px-4 py-2">商品名稱</th>
              <th className="border border-gray-300 px-4 py-2">商品簡介</th>
              <th className="border border-gray-300 px-4 py-2">商品類別</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="text-center hover:bg-gray-50 transition">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                { // <td className="border border-gray-300 px-4 py-2">{item.customizations.join(' / ')}</td> 
                }
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2">編輯</button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="text-red-600 hover:underline"
                  >
                    刪除
                  </button>
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
              <input name="name" placeholder="商品名稱" className="border p-2 rounded" value={formData.name} onChange={handleChange} />
              <input type="text" name="category" placeholder="商品類別" className="border p-2 rounded" value={formData.category} onChange={handleChange} />
              <input type="text" name="description" placeholder="商品介紹" className="border p-2 rounded col-span-2" value={formData.description} onChange={handleChange} />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={() => setShowModal(false)}>取消</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handleSubmit}>送出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
