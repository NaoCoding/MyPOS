import React, { useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';
import SignUp from './components/signup';
import Dashboard from './pages/Dashboard';
import OrderPage from './pages/Order';
import ProductItemForm from './pages/ProductItemForm';
import OrderManagement from './pages/OrderManagement';

/*import Checkout from './pages/Checkout';
import Inventory from './pages/Inventory';
import DailyReport from './pages/DailyReport';
import MonthlyReport from './pages/MonthlyReport';
import SalesRanking from './pages/SalesRanking';
import CustomerAnalysis from './pages/CustomerAnalysis';
import NoteAnalysis from './pages/NoteAnalysis';
import NoteManagement from './pages/NoteManagement';
import StaffSetting from './pages/StaffSetting';
import PermissionSetting from './pages/PermissionSetting';
import SystemSetting from './pages/SystemSetting';
import TransactionRecords from './pages/TransactionRecords';
import ShiftReport from './pages/ShiftReport';*/

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<OrderPage />} />
        {/*下面兩行到時候拿掉*/}
        <Route path="/login" element={<Login setToken={() => {}} />} />
        <Route path="/signup" element={<SignUp />} />

         {/*門市作業*/}
        <Route path="/結帳" element={<OrderPage />} />
        {/*<Route path="/庫存管理" element={<Inventory />} />

        {/* 報表作業
        <Route path="/交班表" element={<ShiftReport />} />
        <Route path="/日報表" element={<DailyReport />} />
        <Route path="/月報表" element={<MonthlyReport />} />
        <Route path="/交易紀錄" element={<TransactionRecords />} />
        */}
        {/* 經營分析
        <Route path="/銷售排行" element={<SalesRanking />} />
        <Route path="/客群分析" element={<CustomerAnalysis />} />
        <Route path="/備註分析" element={<NoteAnalysis />} />
        */}
        {/* 資料管理*/}
        <Route path="/商品管理" element={<ProductItemForm />} />
        <Route path="/訂單管理" element={<OrderManagement />} />
        {/* 
        <Route path="/備註管理" element={<NoteManagement />} />
        <Route path="/人員設定" element={<StaffSetting />} />
        <Route path="/權限設定" element={<PermissionSetting />} />
        <Route path="/系統設定" element={<SystemSetting />} />
        */}

      </Routes>

    </div>
  );
}

export default App;
