import React, { useEffect, useState } from 'react';

interface Customization {
  id: number;
  name: string;
  description: string;
  customization_group_id: number;
  customization_group_name: string;
  is_available: boolean;
}

interface CustomizationGroup {
  id: number;
  name: string;
}

interface NewCustomization {
  name: string;
  customization_group_id: number;
  customization_group_name: Customization['customization_group_name'];
  description: string;
  is_available: boolean;
  price_delta: number;
}

export default function NoteSettings() {
  const backendURL = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [customizationGroups, setCustomizationGroups] = useState<CustomizationGroup[]>([]);
  const [newCustomization, setNewCustomization] = useState<NewCustomization>({
    name: '',
    customization_group_id: customizationGroups.length > 0 ? customizationGroups[0].id : 0,
    customization_group_name: customizationGroups.length > 0 ? customizationGroups[0].name : '',
    description: '',
    is_available: true,
    price_delta: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomizations = async () => {
    try {
      setLoading(true);
      const customizationsResponse = await fetch(`${backendURL}/customization`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!customizationsResponse.ok) {
        console.log("HTTP error:", customizationsResponse.status, await customizationsResponse.json());
        throw new Error(`HTTP error! status: ${customizationsResponse.status}`);
      }

      const customizationsData = await customizationsResponse.json();
      setCustomizations(customizationsData);

      const customizationGroupsResponse = await fetch(`${backendURL}/customization/group`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!customizationGroupsResponse.ok) {
        console.log("HTTP error:", customizationGroupsResponse.status, await customizationGroupsResponse.json());
        throw new Error(`HTTP error! status: ${customizationGroupsResponse.status}`);
      }

      const customizationGroupsData = await customizationGroupsResponse.json();
      setCustomizationGroups(customizationGroupsData);
      setNewCustomization({
        name: '',
        customization_group_id: customizationGroupsData.length > 0 ? customizationGroupsData[0].id : 0,
        customization_group_name: customizationGroupsData.length > 0 ? customizationGroupsData[0].name : '',
        description: '',
        is_available: true,
        price_delta: 0,
      });
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error("Failed to fetch items:", error);

      setCustomizations([]);
      setCustomizationGroups([]);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const handleAdd = async () => {
    if (!newCustomization.name.trim()) {
      alert('請輸入備註內容');
      return;
    }

    try {
      const response = await fetch(`${backendURL}/customization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomization),
      });

      if (!response.ok) {
        console.log("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchCustomizations();
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('新增備註時發生未知錯誤');
      }
      console.error("Failed to add customization:", error);
      return;
    }
  };

  const toggleEnable = async (id: number) => {
    const customization = customizations.find(n => n.id === id);
    customization!.is_available = !customization!.is_available;

    try {
      const response = await fetch(`${backendURL}/customization/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customization),
      });

      if (!response.ok) {
        console.log("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchCustomizations();
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('新增備註時發生未知錯誤');
      }
      console.error("Failed to add customization:", error);
      return;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('確定要刪除這筆備註嗎？')) {
      return;
    }

    try {
      const response = await fetch(`${backendURL}/customization/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchCustomizations();
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('新增備註時發生未知錯誤');
      }
      console.error("Failed to add customization:", error);
      return;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">備註管理</h1>

      {/* 📋 備註清單 */}
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">備註內容</th>
            <th className="border px-4 py-2 text-left">類型</th>
            <th className="border px-4 py-2 text-center">狀態</th>
            <th className="border px-4 py-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {customizations.map(note => (
            <tr key={note.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{note.name}</td>
              <td className="border px-4 py-2">{note.customization_group_name}</td>
              <td className="border px-4 py-2 text-center">
                <span className={note.is_available ? 'text-green-600' : 'text-gray-500'}>
                  {note.is_available ? '啟用中' : '停用'}
                </span>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => toggleEnable(note.id)}
                >
                  {note.is_available ? '停用' : '啟用'}
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(note.id)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ➕ 新增備註 */}
      <div className="bg-gray-50 border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">新增備註</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="備註內容（如：加飯）"
            className="border p-2 rounded flex-1"
            value={newCustomization.name}
            onChange={(e) => setNewCustomization({ ...newCustomization, name: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newCustomization.customization_group_name}
            onChange={(e) => {
              console.log(e.target.selectedOptions[0]);
              setNewCustomization({
                ...newCustomization,
                customization_group_id: Number(e.target.selectedOptions[0].id),
                customization_group_name: e.target.value as Customization['customization_group_name']
              });
            }}
          >
            {customizationGroups.map(group => (
              <option key={group.id} id={group.id.toString()} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAdd}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}
