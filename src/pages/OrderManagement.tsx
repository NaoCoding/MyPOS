// src/pages/OrderManagement.tsx
import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const backendAPI = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
  unit_price: number; 
  discount_amount?: number;
  discount_type?: 'percentage' | 'fixed';
}

interface Order {
  id: number;
  trade_datetime: string;
  trade_items: OrderItem[];
  total: number;
}



export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderData , setOrderData] = useState<Order[]>();
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchOrders = async () => {
      const response = await fetch(backendAPI+'/trade');
      if (!response.ok) {
        console.error('Failed to fetch orders');
        return;
      }
      const orders: Order[] = await response.json();
      console.log('Fetched orders:', orders);
      setOrderData(orders);

      const countTotalPrice = (items: OrderItem[]) => {
        return items.reduce((total, item) => {
          // 确保 unit_price 有默认值
          const unitPrice = item.unit_price || 0;
          
          if (item.discount_type === 'percentage' && item.discount_amount) {
            return total + unitPrice * (item.discount_amount) * item.quantity;
          }
          else if (item.discount_type === 'fixed' && item.discount_amount) {
            return total + item.discount_amount * item.quantity;
          }
          else {
            // 默认情况：无折扣
            return total + unitPrice * item.quantity;
          }
        }, 0);
      };
      

      const ordersWithTotal = orders.map(order => ({
        ...order,
        total: countTotalPrice(order.trade_items)
      }));
      
      setOrderData(ordersWithTotal);

    }

    setSelectedOrder(null);
    fetchOrders();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-1/3 bg-blue-100 p-4 border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4">
          {selectedOrder ? `訂單編號：${selectedOrder.id}` : '請選擇訂單'}
        </h2>
        {selectedOrder && selectedOrder.trade_items.map((item, idx) => (
          <div key={idx} className="bg-yellow-100 p-2 mb-2 rounded shadow-sm">
            <div>{item.name}</div>
            <div className="text-sm text-gray-600">數量：{item.quantity}</div>
            {item.notes && <div className="text-sm text-gray-600">備註：{item.notes}</div>}
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-6 bg-white overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">歷史訂單列表</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/Checkout')}
          >
            返回點餐
          </button>
        </div>
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border border-gray-300 px-4 py-2">訂單編號</th>
              <th className="border border-gray-300 px-4 py-2">訂單日期</th>
              <th className="border border-gray-300 px-4 py-2">商品數量</th>
              <th className="border border-gray-300 px-4 py-2">總金額</th>
            </tr>
          </thead>
          <tbody>
            {orderData?.map(order => (
              <tr
                key={order.id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{new Date(order.trade_datetime).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{order.trade_items.length}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
