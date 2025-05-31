import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function OrderTypeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-4 bg-white p-2 border-b">
      {['內用', '外帶', '外送'].map(type => (
        <button
          key={type}
          className={`px-4 py-2 border rounded ${value === type ? 'bg-blue-300' : 'bg-gray-100'}`}
          onClick={() => onChange(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
