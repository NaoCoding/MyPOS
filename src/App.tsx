import React, { useState, useEffect } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';
import SignUp from './components/signup';

function App() {
  const [token, setToken] = useState<string>('');
  const [roleId, setRoleId] = useState<number>(0);

  // 檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/checkAuth', {
          method: 'GET',
          credentials: 'include', // 重要：包含 httpOnly cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setToken(data.token);
            setRoleId(data.role_id);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
      }
    };

    checkAuth();
  }, []);



  // 如果沒有 token，顯示登入頁面
  if (!token) {
    return (
      <div>
        <NextTopLoader color='#565656' showSpinner={false} />
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    );
  }

  // 如果有 token，顯示主頁面
  return (
    <div className="app_container">
      <Navbar role_id={roleId} setToken={setToken} />
      <NextTopLoader color='#565656' showSpinner={false} />
    </div>
  );
}

export default App;
