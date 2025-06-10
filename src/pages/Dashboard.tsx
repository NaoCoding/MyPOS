// Dashboard.tsx
import React from 'react';
import SectionBlock from '../components/SectionBlock';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1>MyPOS!!!! 點餐系統</h1>
        <p>美味餐點，輕鬆點選 ✨</p>
      </div>

      <div className="dashboard-grid">
        <SectionBlock
          title="門市作業"
          buttons={[
            { label: '🧾 結帳', path: '/Checkout' },
            { label: '📦 庫存管理', path: '/Inventory' },
          ]}
        />
        <SectionBlock
          title="報表作業"
          buttons={[
            { label: '👥 交班表', path: '/Report/Shift' },
            { label: '📅 日報表', path: '/Report/Daily' },
            { label: '📊 月報表', path: '/Report/Monthly' },
          ]}
        />
        <SectionBlock
          title="經營分析"
          buttons={[
            { label: '🏆 銷售排行', path: '/SalesRanking' },
            { label: '👨‍👩‍👧‍👦 客群分析', path: '/CustomerAnalysis' },
            { label: '📝 備註分析', path: '/NoteAnalysis' },
          ]}
        />
        <SectionBlock
          title="資料管理"
          buttons={[
            { label: '🛒 商品管理', path: '/ProductItemForm' },
            { label: '📋 訂單管理', path: '/OrderManagement' },
            { label: '🖍 備註管理', path: '/NoteManagement' },
            { label: '🙋‍♂️ 用戶管理', path: '/manage/user' },
            { label: '🔐 權限設定', path: '/PermissionSetting' },
            { label: '⚙️ 系統設定', path: '/SystemSetting' },
          ]}
        />
        <SectionBlock
          title="使用者模擬"
          buttons={[
            { label: '🏠 首頁', path: '/user/Home' },
            { label: '🛍 下單頁', path: '/user/Order' },
            { label: '📨 送出結果', path: '/user/Submit' },
            { label: '📜 歷史訂單', path: '/user/History' },
            { label: '🧑‍💻 使用者註冊', path: '/user/Register' },
            { label: '🚧 404', path: '/NotFound' },
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
