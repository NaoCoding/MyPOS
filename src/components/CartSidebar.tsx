// src/components/CartSidebar.tsx
import React, { useState } from 'react';
import { CartItem } from '../types';

interface Props {
  items: (CartItem & { notes: string[] })[];
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
  onSelect: (id: number) => void;
  selectedId: number | null;
  sharedNotes: string[];
}

export default function CartSidebar({ items, onAdd, onRemove, onSelect, selectedId, sharedNotes }: Props) {
  const [showModal, setShowModal] = useState(false);

  const filteredItems = items.filter(item => item.quantity > 0);

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
          </div>
        ))}

        {sharedNotes.length > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            <div className="font-semibold">共用備註：</div>
            <div>{sharedNotes.filter(n => n.trim() !== '').join(' / ')}</div>
          </div>
        )}
      </div>

      <button className="mt-4 w-full bg-pink-400 py-2 rounded" onClick={() => setShowModal(true)}>結帳：$$$</button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">結帳資訊</h2>

            <div className="mb-4 space-y-2">
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
              <button className="flex-1 bg-gray-200 py-1 rounded">現金</button>
              <button className="flex-1 bg-gray-200 py-1 rounded">折扣</button>
              <button className="flex-1 bg-gray-200 py-1 rounded">XX 折</button>
            </div>

            <div className="text-center text-red-600 font-bold space-y-1 mb-4">
              <div>已收：XX</div>
              <div>未收：XX</div>
              <div className="text-black">找零：XX</div>
            </div>

            <div className="flex justify-around">
              <button className="bg-red-600 text-white px-4 py-2 rounded">結帳</button>
              <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={() => setShowModal(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
