import React, { useState } from 'react';

export default function SettingsPage() {
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [taxRate, setTaxRate] = useState(5);
  const [defaultDiscount, setDefaultDiscount] = useState('100');
  const [invoiceEnabled, setInvoiceEnabled] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [language, setLanguage] = useState('zh-TW');

  const handleSave = () => {
    const settings = {
      openTime,
      closeTime,
      taxRate,
      defaultDiscount,
      invoiceEnabled,
      showDetails,
      language,
    };
    console.log('✅ 儲存設定:', settings);
    alert('設定已儲存！');
    // TODO: 可串接後端 API 儲存設定
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white mt-10 rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">系統設定</h1>

      {/* 營業時間 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">⏰ 營業時間</h2>
        <div className="flex gap-4">
          <label className="block">
            開店時間：
            <input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="ml-2 border p-1 rounded" />
          </label>
          <label className="block">
            關店時間：
            <input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="ml-2 border p-1 rounded" />
          </label>
        </div>
      </div>

      {/* 稅率與折扣 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">💵 稅率與折扣</h2>
        <div className="flex gap-4">
          <label>
            稅率：
            <input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="ml-2 w-20 border p-1 rounded" /> %
          </label>
          <label>
            預設折扣：
            <select value={defaultDiscount} onChange={(e) => setDefaultDiscount(e.target.value)} className="ml-2 border p-1 rounded">
              <option value="100">無折扣</option>
              <option value="95">95 折</option>
              <option value="90">9 折</option>
              <option value="85">85 折</option>
            </select>
          </label>
        </div>
      </div>

      {/* 發票與單據 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🧾 發票與單據</h2>
        <label className="block mb-2">
          <input type="checkbox" checked={invoiceEnabled} onChange={() => setInvoiceEnabled(!invoiceEnabled)} className="mr-2" />
          啟用電子發票
        </label>
        <label className="block">
          <input type="checkbox" checked={showDetails} onChange={() => setShowDetails(!showDetails)} className="mr-2" />
          顯示交易明細於單據中
        </label>
      </div>

      {/* 語言設定 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🌐 語言</h2>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border p-2 rounded">
          <option value="zh-TW">繁體中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      {/* 儲存按鈕 */}
      <div className="text-right">
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          儲存設定
        </button>
      </div>
    </div>
  );
}
