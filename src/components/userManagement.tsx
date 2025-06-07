import React, { useState, useEffect } from 'react';
import '../styles/userManagement.css';

interface User {
  id: number;
  username: string;
  email: string;
  telephone: string;
  role_id: number;
  created_at: string;
}

interface UserForm {
  username: string;
  email: string;
  telephone: string;
  password: string;
  role_id: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserForm>({
    username: '',
    email: '',
    telephone: '',
    password: '',
    role_id: '1'
  });

  // 處理 API 錯誤
  const handleApiError = async (response: Response) => {
    const data = await response.json();
    if (response.status === 403) {
      setError('權限不足：僅限管理員使用此功能');
      return;
    }
    if (response.status === 401) {
      setError('請重新登入');
      return;
    }
    setError(data.message || '操作失敗');
  };

  // 獲取所有用戶
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        credentials: 'include', // 重要：包含 httpOnly cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setError(''); // 清除之前的錯誤
      } else {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('網路錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 處理表單輸入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 創建或更新用戶
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingUser 
        ? `http://localhost:5000/api/users/${editingUser.id}`
        : 'http://localhost:5000/api/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // 重要：包含 httpOnly cookies
      });

      const data = await response.json();

      if (response.ok) {
        alert(editingUser ? '用戶更新成功' : '用戶創建成功');
        setFormData({
          username: '',
          email: '',
          telephone: '',
          password: '',
          role_id: '1'
        });
        setEditingUser(null);
        setError(''); // 清除錯誤
        fetchUsers(); // 重新獲取用戶列表
      } else {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('網路錯誤');
    }
  };

  // 刪除用戶
  const handleDelete = async (userId: number) => {
    if (!window.confirm('確定要刪除此用戶嗎？')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include', // 重要：包含 httpOnly cookies
      });

      const data = await response.json();

      if (response.ok) {
        alert('用戶刪除成功');
        setError(''); // 清除錯誤
        fetchUsers(); // 重新獲取用戶列表
      } else {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('網路錯誤');
    }
  };

  // 編輯用戶
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      telephone: user.telephone,
      password: '',
      role_id: user.role_id.toString()
    });
  };

  // 取消編輯
  const handleCancel = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      telephone: '',
      password: '',
      role_id: '1'
    });
  };

  // 獲取角色名稱
  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1: return 'User';
      case 4: return 'Admin';
      default: return 'Unknown';
    }
  };

  // 獲取角色樣式
  const getRoleClass = (roleId: number) => {
    switch (roleId) {
      case 1: return 'role-user';
      case 4: return 'role-admin';
      default: return 'role-user';
    }
  };

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <div className="user-management-container">
      <h1 className="user-management-header">用戶管理</h1>

      {error && <div className="error">{error}</div>}

      {/* 新增/編輯用戶表單 */}
      <div className="add-user-section">
        <h2 className="add-user-header">
          {editingUser ? '編輯用戶' : '新增用戶'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="user-form">
            <div className="form-group">
              <label className="form-label">用戶名</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">電子郵件</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">電話</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                密碼 {editingUser && '(留空表示不修改)'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required={!editingUser}
              />
            </div>
            <div className="form-group">
              <label className="form-label">角色</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="1">User</option>
                <option value="4">Admin</option>
              </select>
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingUser ? '更新用戶' : '創建用戶'}
            </button>
            {editingUser && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="users-table-section">
        <h2 className="users-table-header">用戶列表</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用戶名</th>
              <th>電子郵件</th>
              <th>電話</th>
              <th>角色</th>
              <th>創建時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.telephone}</td>
                <td>
                  <span className={`role-badge ${getRoleClass(user.role_id)}`}>
                    {getRoleName(user.role_id)}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-secondary btn-small"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-danger btn-small"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}