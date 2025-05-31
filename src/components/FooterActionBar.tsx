import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FooterActionBar() {
  const navigate = useNavigate();

  return (
    <div className="bg-pink-200 p-3 flex justify-around">
      <button className="px-4 py-2 bg-white rounded">取消點單</button>
      <button className="px-4 py-2 bg-white rounded">訂單備註</button>
      <button
        className="px-4 py-2 bg-white rounded"
        onClick={() => navigate('/訂單管理')}
      >
        訂單查詢
      </button>
    </div>
  );
}
