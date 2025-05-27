import React, { useState, useEffect } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';
import SignUp from './components/signup';
import UserManagement from './components/userManagement';

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
  if(roleId === 1){
    return (
      <div className="app_container">
        <NextTopLoader color='#565656' showSpinner={false} />
        <Navbar role_id={roleId} setToken={setToken} />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/history" element={<div>Order History Page</div>} />
          <Route path="/setting" element={<div>Setting Page</div>} />
        </Routes>
      </div>
    );
  }

  else if(roleId === 4) {
    return (
      <div className="app_container">
        <NextTopLoader color='#565656' showSpinner={false} />
        <Navbar role_id={roleId} setToken={setToken} />
        <Routes>
          <Route path="/" element={<div>Manager Home Page</div>} />
          <Route path="/manage/user" element={<UserManagement/>} />
        </Routes>
      </div>
    );
  }

  else{
    return (<div></div>)
  }
}

export default App;
