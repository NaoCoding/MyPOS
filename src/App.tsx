import React, { useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route } from "react-router-dom";
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


  //ToDo connect to backend to detect role for different routes
  return (
    <div className="app_container">
      <Navbar />
      <NextTopLoader color='#565656' showSpinner={false} />
      <Routes>
        {/* 基本頁面 */}
        <Route path="/" element={<Dashboard/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />

        {/*下面兩行到時候拿掉*/}
        <Route path="/login" element={<Login setToken={() => {}} />} />
        <Route path="/signup" element={<SignUp/>} />

         {/*門市作業*/}
        <Route path="/Checkout" element={<Checkout/>} />
        <Route path="/inventory" element={<Inventory/>} />

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
        <Route path="/StaffSetting" element={<StaffSetting/>} />
        <Route path="/NoteManagement" element={<NoteManagement/>} />
        <Route path="/PermissionSetting" element={<PermissionSetting/>} />

      </Routes>

    </div>
  );
}

export default App;
