import React, { useState } from 'react';

type Role = '系統管理員' | '店長' | '店員';

type PermissionKey =
  | 'view_report'
  | 'edit_product'
  | 'delete_user'
  | 'checkout'
  | 'export_data'
  | 'adjust_price';

const permissionLabels: Record<PermissionKey, string> = {
  view_report: '查看報表',
  edit_product: '編輯商品',
  delete_user: '刪除使用者',
  checkout: '執行結帳',
  export_data: '匯出資料',
  adjust_price: '修改售價',
};

const roleOptions: Role[] = ['系統管理員', '店長', '店員'];

export default function PermissionSettings() {
  const [permissions, setPermissions] = useState<Record<Role, Record<PermissionKey, boolean>>>({
    系統管理員: {
      view_report: true,
      edit_product: true,
      delete_user: true,
      checkout: true,
      export_data: true,
      adjust_price: true,
    },
    店長: {
      view_report: true,
      edit_product: true,
      delete_user: false,
      checkout: true,
      export_data: true,
      adjust_price: true,
    },
    店員: {
      view_report: false,
      edit_product: false,
      delete_user: false,
      checkout: true,
      export_data: false,
      adjust_price: false,
    },
  });

  const handleToggle = (role: Role, perm: PermissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm],
      },
    }));
  };

  const handleSave = () => {
    console.log('🔐 權限設定已儲存：', permissions);
    alert('權限設定已儲存');
    // TODO: 可串 API: POST /api/roles/permissions
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">權限管理</h1>

      <div className="overflow-x-auto">
        <table className="table-auto border border-gray-300 text-sm w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">功能</th>
              {roleOptions.map(role => (
                <th key={role} className="border px-4 py-2">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(permissionLabels).map((key) => {
              const permKey = key as PermissionKey;
              return (
                <tr key={permKey} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{permissionLabels[permKey]}</td>
                  {roleOptions.map((role) => (
                    <td key={role} className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[role][permKey]}
                        onChange={() => handleToggle(role, permKey)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          儲存權限設定
        </button>
      </div>
    </div>
  );
}
