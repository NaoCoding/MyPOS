import React, { useState, useEffect } from 'react';
import Select from 'react-select'

interface InventoryItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  discount: string;
  discount_type: string;
  discount_amount: number;
  discount_amount_string?: string; // 可選，若需要顯示折扣金額
  category: string;
}


export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [productList , setProductList] = useState<{ id: number; name: string }[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: NaN,
    unit_price: '',
    discount: '',
    discount_type: 'percentage',
    discount_amount: NaN,
    discount_amount_string: '',
    product_id: NaN,
    optionObject: { label: '', value: NaN }
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('全部');

  const discount_type = ['percentage', 'fixed'];
  //const discount_type = ['percentage', 'fixed'];

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true); // 開始載入前設置 loading
      const response = await fetch('http://localhost:5000/item', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.log("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as InventoryItem[];
      console.log("Fetched items:", data);
      await Promise.all(data.map(async (element) => {
        try {
          
          element.discount = element.discount_type === 'percentage'
            ? ((element.discount_amount && element.discount_amount !== 1) ? `${element.discount_amount*100}%` : '無折扣') 
            : (element.discount_amount ? `${element.discount_amount} 元` : '無折扣');
          const nameFetch = await fetch(`http://localhost:5000/product/${element.product_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!nameFetch.ok) {
            console.log("HTTP error:", nameFetch.status, await nameFetch.json());
            throw new Error(`HTTP error! status: ${nameFetch.status}`);
          }
          const nameData = await nameFetch.json();
          element.name = nameData.name;
          element.category = nameData.category || '未分類'; // 如果沒有類別，設為 '未分類'
        } catch (error) {
          console.error(`Failed to fetch name for item ${element.id}:`, error);
          element.name = `Unknown Item #${element.id}`;  
        }
      }))

      setItems(data);

      const productResponse = await fetch('http://localhost:5000/product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!productResponse.ok) {
        console.log("HTTP error:", productResponse.status, await productResponse.json());
        throw new Error(`HTTP error! status: ${productResponse.status}`);
      }
      const productData = await productResponse.json();
      setProductList(productData);
      console.log("Fetched product list:", productData);
      
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

  const AddItem = async () => {
    newItem.name = newItem.optionObject.label;
    newItem.product_id = newItem.optionObject.value;
    //newItem.quantity = parseInt(newItem.quantity);

    if (!newItem.name || !newItem.quantity || !newItem.unit_price || !newItem.discount_amount_string) {
      alert('請填寫商品名稱、初始庫存、價格與折扣');
      return;
    }
    try {
      console.log("Adding new item:", newItem);
      const response = await fetch('http://localhost:5000/item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: newItem.product_id,
          name: newItem.name,
          quantity: newItem.quantity,
          unit_price: parseFloat(newItem.unit_price),
          discount: newItem.discount,
          discount_type: newItem.discount_type,
          discount_amount: parseFloat(newItem.discount_amount_string),
        }),
      });

      if (!response.ok) {
        console.error("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //const data = await response.json();
      //console.log("New item added:", data);

      

      fetchItems()

    }
    catch (error) {
      console.error('Error adding item:', error);
    }
  } 
  

  const handleStockChange = (id: number, newStock: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newStock } : i));
  };

  const filtered = items.filter(i =>
    (filter === '全部' || i.category === filter) &&
    i.name.includes(search)
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm('確定要刪除此商品嗎？')) return;
    try {
      const response = await fetch(`http://localhost:5000/item/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(`Item ${id} deleted successfully`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('刪除商品失敗，請稍後再試');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">📦 庫存管理</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input type="text" placeholder="搜尋商品" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded flex-1 min-w-[200px]" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="全部">全部分類</option>
          {discount_type.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">匯出 CSV</button>
      </div>

      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">商品名稱</th>
            <th className="border px-4 py-2">分類</th>
            <th className="border px-4 py-2 text-right">庫存</th>
            <th className="border px-4 py-2 text-right">價格</th>
            <th className="border px-4 py-2 text-right">折扣</th>
            <th className="border px-4 py-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className={''}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2 text-right">{item.quantity}</td>
              <td className="border px-4 py-2 text-right">{item.unit_price}</td>
              <td className="border px-4 py-2 text-right">{item.discount}</td>
              <td className="border px-4 py-2 text-right">
                <button onClick={() => console.log()} className="text-blue-600 hover:underline mr-2">修改</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-gray-50 border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">➕ 新增商品至庫存</h2>
        <div className="grid grid-cols-5 gap-4">
          <Select className='border p-2 rounded'
                    options={productList.map(p => ({ label: p.name, value: p.id }))}
                    onChange={(value) => {
                      if(!value) return;
                      setNewItem({ ...newItem, name: value.label });
                      setNewItem({ ...newItem, product_id: value.value });
                      setNewItem({ ...newItem, optionObject: value });
                    }}
                    value={newItem.optionObject}
                    placeholder="請選擇商品"
                    isMulti={false}
          />
          <input type="number" placeholder="初始庫存" className="border p-2 rounded" value={Number.isNaN(newItem.quantity) ? '' : newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} />
          <input type="number" placeholder="價格" className="border p-2 rounded" value={newItem.unit_price} onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })} />
          <input type="string" placeholder="折扣" className="border p-2 rounded" value={newItem.discount_amount_string} onChange={(e) => setNewItem({ ...newItem, discount_amount_string:  e.target.value})} />
          <select className="border p-2 rounded" value={newItem.discount_type} onChange={(e) => setNewItem({ ...newItem, discount_type: e.target.value })}>
            {discount_type.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="text-right mt-4">
          <button onClick={AddItem} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">新增商品</button>
        </div>
      </div>
    </div>
  );
}
