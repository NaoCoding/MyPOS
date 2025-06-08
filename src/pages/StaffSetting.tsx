import React, { useState } from 'react';

interface Staff {
  id: number;
  name: string;
  role: '店長' | '店員' | '系統管理員';
  store: string;
  account: string;
  active: boolean;
}

export default function StaffSettings() {
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: 1, name: '小王', role: '店長', store: '台北店', account: 'manager01', active: true },
    { id: 2, name: '阿美', role: '店員', store: '台中店', account: 'staff02', active: true },
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    account: '',
    password: '',
    role: '店員' as Staff['role'],
    store: '台北店',
  });

  const storeOptions = ['台北店', '台中店', '高雄店'];

  const handleAdd = () => {
    if (!newStaff.name || !newStaff.account || !newStaff.password) {
      alert('請填寫完整資料');
      return;
    }

    const newEntry: Staff = {
      id: staffList.length + 1,
      name: newStaff.name,
      role: newStaff.role,
      store: newStaff.store,
      account: newStaff.account,
      active: true,
    };
    setStaffList(prev => [...prev, newEntry]);
    setNewStaff({ name: '', account: '', password: '', role: '店員', store: '台北店' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('確定要刪除這位員工嗎？')) {
      setStaffList(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">人員設定</h1>

      {/* 👥 人員清單 */}
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">姓名</th>
            <th className="border px-4 py-2">角色</th>
            <th className="border px-4 py-2">所屬店鋪</th>
            <th className="border px-4 py-2">帳號</th>
            <th className="border px-4 py-2 text-center">狀態</th>
            <th className="border px-4 py-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{s.name}</td>
              <td className="border px-4 py-2">{s.role}</td>
              <td className="border px-4 py-2">{s.store}</td>
              <td className="border px-4 py-2">{s.account}</td>
              <td className="border px-4 py-2 text-center">
                {s.active ? <span className="text-green-600">啟用中</span> : <span className="text-gray-500">停用</span>}
              </td>
              <td className="border px-4 py-2 text-center">
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(s.id)}>刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ➕ 新增人員 */}
      <div className="bg-gray-50 border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">新增人員</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="姓名"
            className="border p-2 rounded"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newStaff.role}
            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as Staff['role'] })}
          >
            <option value="店員">店員</option>
            <option value="店長">店長</option>
            <option value="系統管理員">系統管理員</option>
          </select>
          <input
            type="text"
            placeholder="帳號"
            className="border p-2 rounded"
            value={newStaff.account}
            onChange={(e) => setNewStaff({ ...newStaff, account: e.target.value })}
          />
          <input
            type="password"
            placeholder="密碼"
            className="border p-2 rounded"
            value={newStaff.password}
            onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
          />
          <select
            className="border p-2 rounded col-span-2"
            value={newStaff.store}
            onChange={(e) => setNewStaff({ ...newStaff, store: e.target.value })}
          >
            {storeOptions.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="text-right mt-4">
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            新增人員
          </button>
        </div>
      </div>
    </div>
  );
}
