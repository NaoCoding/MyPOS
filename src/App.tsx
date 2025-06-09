import React, { useState, useEffect } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';
import SignUp from './components/signup';
import UserManagement from './components/userManagement';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import ProductItemForm from './pages/ProductItemForm';
import OrderManagement from './pages/OrderManagement';
import ShiftReport from './pages/ShiftReport';
import DailyReport from './pages/DailyReport';
import MonthlyReport from './pages/MonthlyReport';
import SystemSetting from './pages/SystemSetting';
import StaffSetting from './pages/StaffSetting';
import NoteManagement from './pages/NoteManagement';
import PermissionSetting from './pages/PermissionSetting';
import NoteAnalysis from './pages/NoteAnalysis';
import CustomerAnalysis from './pages/CustomerAnalysis';
import SalesRanking from './pages/SalesRanking';
import Inventory from './pages/Inventory';
import UserHome from './pages/user/UserHome';
import UserOrder from './pages/user/UserOrder';
import UserOrderSubmit from './pages/user/UserOrderSubmit';
import UserOrderHistory from './pages/user/UserOrderHistory';
import UserCustomerInfo from './pages/user/CustomerInfo';
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import NotFound from './pages/NotFound';
const backendAPI = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';

function App() {
  const [token, setToken] = useState<string>('');
  const [roleId, setRoleId] = useState<number>(0);
  const [cssLoaded, setCssLoaded] = useState<boolean>(false);

  // 檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(backendAPI+'/auth/checkAuth', {
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

  useEffect(() => {
    if (token && !cssLoaded) {
      import('./index.css').then(() => {
        setCssLoaded(true);
      }).catch((error) => {
        console.error('Failed to load CSS:', error);
      });
    }
  }, [token, cssLoaded]);



  // 如果沒有 token，顯示登入頁面
  if (!token) {
    return (
      <div className="app_container">
        <NextTopLoader color='#565656' showSpinner={false} />
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user/Login" element={<UserLogin/>} />
          <Route path="/user/Register" element={<UserRegister/>} />
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
          <Route path="/" element={<UserHome />} />
          <Route path="/user/Home" element={<UserHome />} />
          <Route path="/user/Order" element={<UserOrder />} />
          <Route path="/user/Submit" element={<UserOrderSubmit />} />
          <Route path="/user/History" element={<UserOrderHistory />} />
          <Route path="/user/CustomerInfo" element={<UserCustomerInfo />} />
        </Routes>
      </div>
    );
  }

  else if(roleId >= 2){
    return (
      <div className="app_container">
        <Navbar role_id={roleId} setToken={setToken} />
        <NextTopLoader color='#565656' showSpinner={false} />
        <Routes>
          {/* 基本頁面 */}
          <Route path="/" element={<Dashboard/>} />
          <Route path="/Dashboard" element={<Dashboard/>} />

          {/*門市作業*/}
          <Route path="/Checkout" element={<Checkout/>} />
          <Route path="/Inventory" element={<Inventory/>} />

          {/* 報表作業*/}
          <Route path="/ShiftReport" element={<ShiftReport/>} />
          <Route path="/DailyReport" element={<DailyReport/>} />
          <Route path="/MonthlyReport" element={<MonthlyReport/>} />
          
          {/* 經營分析*/}
          <Route path="/NoteAnalysis" element={<NoteAnalysis/>} />
          <Route path="/CustomerAnalysis" element={<CustomerAnalysis/>} />
          <Route path="/SalesRanking" element={<SalesRanking/>} />

          {/* 資料管理*/}
          <Route path="/ProductItemForm" element={<ProductItemForm/>} />
          <Route path="/OrderManagement" element={<OrderManagement/>} />
          <Route path="/SystemSetting" element={<SystemSetting/>} />
          <Route path="/manage/user" element={<UserManagement/>} />
          <Route path="/NoteManagement" element={<NoteManagement/>} />
          <Route path="/PermissionSetting" element={<PermissionSetting/>} />

          if(role_id == 4){
            <Route path="/manage/user" element={<UserManagement/>} />
          }

          <Route path="/user/Home" element={<UserHome />} />
          <Route path="/user/Order" element={<UserOrder />} />
          <Route path="/user/Submit" element={<UserOrderSubmit />} />
          <Route path="/user/History" element={<UserOrderHistory />} />
          <Route path="/user/CustomerInfo" element={<UserCustomerInfo />} />
          <Route path="/user/Login" element={<UserLogin/>} />
          <Route path="/user/Register" element={<UserRegister/>} />
          <Route path="*" element={<NotFound />} />

        </Routes>

      </div>
    )

  }

  

  else{
    return (<div></div>)
  }
}

export default App;
