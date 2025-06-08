import React, { useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route, useLocation } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';
import SignUp from './components/signup';
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
import Mobile_Home from './pages/Mobile/Mobile_Home';
import Mobile_Order from './pages/Mobile/Mobile_Order';
import Mobile_OrderSubmit from './pages/Mobile/Mobile_OrderSubmit';
import Mobile_OrderHistory from './pages/Mobile/Mobile_OrderHistory';
import Mobile_CustomerInfo from './pages/Mobile/Mobile_CustomerInfo';
function App() {

  //ToDo token connection with backend api
  const [token, setToken] = useState<string>('');

  /*if (!token) {
    return (
      <div>
        <NextTopLoader color='#565656' showSpinner={false} />
        <Login setToken={setToken} />
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    );
  }*/

  const location = useLocation();
 const hideNavbarRoutes = [
  '/Mobile/Home',
  '/Mobile/Order',
  '/Mobile/Submit',
  '/Mobile/History',
  '/Mobile/CustomerInfo'
];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  //ToDo connect to backend to detect role for different routes
  return (
    <div className="app_container">
      {!shouldHideNavbar && <Navbar />}
      <NextTopLoader color='#565656' showSpinner={false} />
      <Routes>
        {/* 基本頁面 */}
        <Route path="/" element={<Dashboard/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />

        {/*下面兩行到時候拿掉*/}
        <Route path="/Login" element={<Login setToken={() => {}} />} />
        <Route path="/Signup" element={<SignUp/>} />

         {/*門市作業*/}
        <Route path="/Checkout" element={<Checkout/>} />
        <Route path="/Inventory" element={<Inventory/>} />

        {/* 報表作業*/}
        <Route path="/Report/Shift" element={<ShiftReport/>} />
        <Route path="/Report/Daily" element={<DailyReport/>} />
        <Route path="/Report/Monthly" element={<MonthlyReport/>} />
        
        {/* 經營分析*/}
        <Route path="/NoteAnalysis" element={<NoteAnalysis/>} />
        <Route path="/CustomerAnalysis" element={<CustomerAnalysis/>} />
        <Route path="/SalesRanking" element={<SalesRanking/>} />

        {/* 資料管理*/}
        <Route path="/ProductItemForm" element={<ProductItemForm/>} />
        <Route path="/OrderManagement" element={<OrderManagement/>} />
        <Route path="/SystemSetting" element={<SystemSetting/>} />
        <Route path="/StaffSetting" element={<StaffSetting/>} />
        <Route path="/NoteManagement" element={<NoteManagement/>} />
        <Route path="/PermissionSetting" element={<PermissionSetting/>} />

        {/* 手機端頁面 */}
        <Route path="/Mobile/Home" element={<Mobile_Home />} />
        <Route path="/Mobile/Order" element={<Mobile_Order />} />
        <Route path="/Mobile/Submit" element={<Mobile_OrderSubmit />} />
        <Route path="/Mobile/History" element={<Mobile_OrderHistory />} />
        <Route path="/Mobile/CustomerInfo" element={<Mobile_CustomerInfo />} />
      </Routes>

    </div>
  );
}

export default App;
