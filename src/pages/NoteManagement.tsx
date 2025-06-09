import React, { useEffect, useState } from 'react';

interface Customization {
  id: number;
  name: string;
  description: string;
  customization_group_id: number;
  customization_group_name: string;
  is_available: boolean;
  price_delta: number;
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

interface NewCustomizationGroup {
  name: string;
  description: string;
  is_required: boolean;
  is_multiple_choice: boolean;
}

interface Items {
  id: number;
  name: string;
  quantity: number;
  customization_groups: CustomizationGroup[];
}

interface NewItemCustomizationGroup {
  item_id: number;
  item_name: string;
  customization_group_id: number;
  customization_group_name: string;
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
  const [newCustomizationGroup, setNewCustomizationGroup] = useState<NewCustomizationGroup>({
    name: '',
    description: '',
    is_required: false,
    is_multiple_choice: false,
  });

  const [items, setItems] = useState<Items[]>([]);
  const [newItemCustomizationGroup, setNewItemCustomizationGroup] = useState<NewItemCustomizationGroup>({
    item_id: 0,
    item_name: '',
    customization_group_id: 0,
    customization_group_name: '',
  });

  const [loadCustomizations, setLoadCustomizations] = useState(true);
  const [loadItemCustomizationGroups, setLoadItemCustomizationGroups] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomizations = async () => {
    try {
      setLoadCustomizations(true);
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
      setLoadCustomizations(false);
    }
  };

  const fetchItemCustomizationGroups = async () => {
    try {
      setLoadItemCustomizationGroups(true);
      const response = await fetch(`${backendURL}/item`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItems(data);
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error("Failed to fetch item customization groups:", error);
    }
    finally {
      setLoadItemCustomizationGroups(false);
    }
  };

  useEffect(() => {
    fetchCustomizations();
    fetchItemCustomizationGroups();
  }, []);

  const handleAddCustomization = async () => {
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

  const handleAddGroup = async () => {
    if (!newCustomizationGroup.name.trim()) {
      alert('請輸入備註類型名稱');
      return;
    }

    try {
      const response = await fetch(`${backendURL}/customization/group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomizationGroup),
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
        setError('新增備註類型時發生未知錯誤');
      }
      console.error("Failed to add customization group:", error);
      return;
    }
  };

  const handleAddItemCustomizationGroup = async () => {
    if (!newItemCustomizationGroup.item_name.trim()) {
      alert('請選擇物品');
      return;
    }

    try {
      const response = await fetch(`${backendURL}/item/customization-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItemCustomizationGroup),
      });

      if (!response.ok) {
        console.log("HTTP error:", response.status, await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchCustomizations();
      fetchItemCustomizationGroups();
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('新增物品備註類型時發生未知錯誤');
      }
      console.error("Failed to add item customization group:", error);
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
        setError('更新備註狀態時發生未知錯誤');
      }
      console.error("Failed to update customization:", error);
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
        setError('刪除備註時發生未知錯誤');
      }
      console.error("Failed to delete customization:", error);
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
            <th className="border px-4 py-2 text-left">價格</th>
            <th className="border px-4 py-2 text-center">狀態</th>
            <th className="border px-4 py-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {customizations.map(note => (
            <tr key={note.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{note.name}</td>
              <td className="border px-4 py-2">{note.customization_group_name}</td>
              <td className="border px-4 py-2">{note.price_delta !== 0 ? `NT$ ${note.price_delta}` : '免費'}</td>
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

      {/* ➕ 新增備註類型 */}
      <div className="bg-gray-50 border rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">新增備註類型</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="備註類型名稱"
            className="border p-2 rounded flex-1"
            value={newCustomizationGroup.name}
            onChange={(e) => setNewCustomizationGroup({ ...newCustomizationGroup, name: e.target.value })}
          />
          <p>是否必填</p>
          <input
            type="checkbox"
            className="mt-2"
            checked={newCustomizationGroup.is_required}
            onChange={(e) => setNewCustomizationGroup({ ...newCustomizationGroup, is_required: e.target.checked })}
          />
          <p>是否多選</p>
          <input
            type="checkbox"
            className="mt-2"
            checked={newCustomizationGroup.is_multiple_choice}
            onChange={(e) => setNewCustomizationGroup({ ...newCustomizationGroup, is_multiple_choice: e.target.checked })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddGroup}
          >
            新增
          </button>
        </div>
        <div className="flex gap-4 mt-2">
          <input
              type="text"
              placeholder="備註介紹描述"
              className="border p-2 rounded flex-1"
              value={newCustomizationGroup.description}
              onChange={(e) => setNewCustomizationGroup({ ...newCustomizationGroup, description: e.target.value })}
            />
        </div>
      </div>

      {/* ➕ 新增備註 */}
      <div className="bg-gray-50 border rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">新增備註</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="備註內容（如：加飯）"
            className="border p-2 rounded flex-1"
            value={newCustomization.name}
            onChange={(e) => setNewCustomization({ ...newCustomization, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="價格（如：10，留空則表示 0）"
            className="border p-2 rounded flex-1"
            value={newCustomization.price_delta}
            onChange={(e) => setNewCustomization({ ...newCustomization, price_delta: Number(e.target.value) })}
          />
          <select
            className="border p-2 rounded"
            value={newCustomization.customization_group_name}
            onChange={(e) => {
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
            onClick={handleAddCustomization}
          >
            新增
          </button>
        </div>
        <div className="flex gap-4 mt-2">
          <input
              type="text"
              placeholder="備註介紹描述"
              className="border p-2 rounded flex-1"
              value={newCustomization.description}
              onChange={(e) => setNewCustomization({ ...newCustomization, description: e.target.value })}
            />
        </div>
      </div>

      <h1 className="text-2xl font-bold mt-10 mb-6">物品備註類型管理</h1>
      <table className="w-full table-auto border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">物品</th>
            <th className="border px-4 py-2 text-center">備註類型</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2 text-center space-x-2">{item.name}</td>
              <td className="border px-4 py-2 text-center space-x-2">
                {item.customization_groups.length > 0 ? (
                  item.customization_groups.map((group) => (
                    <span key={group.id}>{group.name}</span>
                  ))
                ) : (
                  <span>無</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-gray-50 border rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">新增物品備註類型</h2>
        <div className="flex gap-4">
          <select
            className="border p-2 rounded"
            value={newItemCustomizationGroup.item_name}
            onChange={(e) => {
              const selectedItem = items.find(item => item.name === e.target.value);
              if (selectedItem) {
                setNewItemCustomizationGroup({
                  ...newItemCustomizationGroup,
                  item_id: selectedItem.id,
                  item_name: selectedItem.name,
                });
              }
            }}
          >
            <option value="">選擇物品</option>
            {items.map(item => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={newItemCustomizationGroup.customization_group_name}
            onChange={(e) => {
              setNewItemCustomizationGroup({
                ...newItemCustomizationGroup,
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
            onClick={handleAddItemCustomizationGroup}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}