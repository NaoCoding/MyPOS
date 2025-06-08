import React from 'react';

interface Props {
  categories: readonly string[];
  onSelect: (category: string) => void;
}

export default function CategoryColumn({ categories, onSelect }: Props) {
  return (
    <div className="flex flex-col bg-yellow-200 w-24">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="p-8 border-b border-yellow-300 hover:bg-yellow-300"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
