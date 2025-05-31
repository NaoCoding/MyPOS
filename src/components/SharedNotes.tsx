// src/components/SharedNotes.tsx
import React from 'react';

interface Props {
  notes: string[];
  setNotes: (notes: string[]) => void;
}

const SHARED_NOTE_OPTIONS = [
  '需要餐具', '不需要餐具', '請提供湯', '外帶袋', '分裝', '急件處理', '請勿打擾', '幫我叫我名字', '辣一點', '請勿加辣'
];

export default function SharedNotes({ notes, setNotes }: Props) {
  const toggleNote = (note: string) => {
    const newNotes = notes.includes(note)
      ? notes.filter(n => n !== note)
      : [...notes, note];
    setNotes(newNotes);
  };

  return (
    <div className="mb-4">
      <div className="mb-1 text-sm font-semibold">共用備註：</div>
      <div className="grid grid-cols-5 gap-2">
        {SHARED_NOTE_OPTIONS.map((note, idx) => (
          <button
            key={idx}
            onClick={() => toggleNote(note)}
            className={`p-2 border rounded text-sm hover:bg-green-100 ${notes.includes(note) ? 'bg-green-200 ring-2 ring-green-500' : 'bg-green-50'}`}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
}
