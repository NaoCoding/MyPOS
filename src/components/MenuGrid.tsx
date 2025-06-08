import React from 'react';
import { MenuItem } from '../types';

interface Props {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}

export default function MenuGrid({ items, onAdd }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-2">
      {items.map(item => (
        <button
          key={item.id}
          className="bg-white p-7 border hover:bg-gray-200"
          onClick={() => onAdd(item)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
