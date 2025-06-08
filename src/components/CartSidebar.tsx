import React, { useState } from 'react';
import { CartItem } from '../types';

interface Props {
  items: (CartItem & { notes: string[]; addons?: string[] })[]; 
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
  onSelect: (id: number) => void;
  selectedId: number | null;
  sharedNotes: string[];
}


export default function CartSidebar({ items, onAdd, onRemove, onSelect, selectedId, sharedNotes }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'discount'>('cash');
  const [discount, setDiscount] = useState(0);
  const [received, setReceived] = useState('');
  const [focusedField, setFocusedField] = useState<'received' | 'discount' | null>(null);

  const filteredItems = items.filter(item => item.quantity > 0);
  const subtotal = filteredItems.reduce((sum, item) => sum + item.quantity * 100, 0);
  const total = Math.floor(subtotal * (1 - Number(discount) / 100));
  const receivedNum = Number(received);
  const change = Math.max(receivedNum - total, 0);

  const handleKeyboardClick = (val: string) => {
    if (!focusedField) return;
    if (val === 'C') {
      if (focusedField === 'received') setReceived('');
      if (focusedField === 'discount') setDiscount(0);
    } else if (val === '←') {
      if (focusedField === 'received') setReceived(prev => prev.slice(0, -1));
    } else {
      if (focusedField === 'received') setReceived(prev => prev + val);
      if (focusedField === 'discount') setDiscount(prev => Number(String(prev) + val));
    }
  };

  const keyboardKeys = ['1','2','3','4','5','6','7','8','9','0','←','C'];

  return (
    <div className="w-64 bg-blue-100 p-4 flex flex-col justify-between">
      <div>
        <div className="mb-4 text-lg font-bold">訂單編號：XX</div>
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`mb-2 p-2 border rounded cursor-pointer ${selectedId === item.id ? 'bg-white shadow ring-2 ring-blue-400' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <div className="flex justify-between items-center">
              <span>{item.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}>-</button>
                <span>{item.quantity}</span>
                <button onClick={(e) => { e.stopPropagation(); onAdd(item.id); }}>+</button>
              </div>
            </div>
            {item.notes.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                備註：{item.notes.join(' / ')}
              </div>
            )}
            {item.addons && item.addons.length > 0 && (
              <div className="text-sm text-orange-600 mt-1">
                加料：{item.addons.join(' / ')}
              </div>
            )}
          </div>
        ))}

        {sharedNotes.length > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            <div className="font-semibold">共用備註：</div>
            <div>{sharedNotes.filter(n => n.trim() !== '').join(' / ')}</div>
          </div>
        )}
      </div>

      <button className="mt-4 w-full bg-pink-400 py-2 rounded" onClick={() => setShowModal(true)}>結帳：${total}</button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[95%] max-w-5xl">
            <h2 className="text-2xl font-bold mb-4">結帳資訊</h2>
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="space-y-2 mb-4">
                  {filteredItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <div>{item.name}</div>
                        {item.notes.length > 0 && <div className="text-xs text-gray-500">備註：{item.notes.join(' / ')}</div>}
                      </div>
                      <div>x {item.quantity}</div>
                    </div>
                  ))}
                  {sharedNotes.length > 0 && (
                    <div className="text-sm text-gray-700 border-t pt-2 mt-2">
                      共用備註：{sharedNotes.filter(n => n.trim() !== '').join(' / ')}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  <button className={`flex-1 py-2 rounded ${paymentMethod === 'cash' ? 'bg-green-300' : 'bg-gray-200'}`} onClick={() => setPaymentMethod('cash')}>現金</button>
                  <button className={`flex-1 py-2 rounded ${paymentMethod === 'discount' ? 'bg-green-300' : 'bg-gray-200'}`} onClick={() => setPaymentMethod('discount')}>打折</button>
                  <button className={`flex-1 py-2 rounded ${paymentMethod === 'card' ? 'bg-green-300' : 'bg-gray-200'}`} onClick={() => setPaymentMethod('card')}>刷卡</button>
                </div>

                {paymentMethod === 'discount' && (
                  <div className="mb-4">
                    <label className="block mb-1">折扣百分比：</label>
                    <input
                      type="number"
                      value={discount}
                      onFocus={() => setFocusedField('discount')}
                      onChange={e => setDiscount(Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block mb-1">實收金額：</label>
                  <input
                    type="text"
                    value={received}
                    onFocus={() => setFocusedField('received')}
                    onChange={e => setReceived(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="text-left text-red-600 font-bold space-y-1 mb-4 text-lg">
                  <div>小計：${subtotal}</div>
                  <div>折扣後：${total}</div>
                  <div>已收：${received}</div>
                  <div>未收：${Math.max(total - receivedNum, 0)}</div>
                  <div className="text-black">找零：${change}</div>
                </div>

                <div className="flex justify-around">
                  <button className="bg-red-600 text-white px-6 py-3 rounded">結帳</button>
                  <button className="bg-gray-300 text-black px-6 py-3 rounded" onClick={() => setShowModal(false)}>取消</button>
                </div>
              </div>

              <div className="w-64 grid grid-cols-3 gap-2">
                {keyboardKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeyboardClick(key)}
                    className="bg-gray-200 text-xl py-4 rounded hover:bg-gray-300"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
