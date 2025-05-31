import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function PerItemNotes({ value, onChange }: Props) {
  return (
    <textarea
      className="w-full h-16 p-2 border border-green-300 bg-green-100 mb-2"
      placeholder="這類商品的備註..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
