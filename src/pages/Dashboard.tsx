import React from 'react';
import SectionBlock from '../components/SectionBlock';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="main-container">

      <div className="grid-layout">
        <SectionBlock title="門市作業" buttons={['結帳', '庫存管理']} />
        <SectionBlock title="報表作業" buttons={['交班表', '日報表', '月報表', '交易紀錄']} />
        <SectionBlock title="經營分析" buttons={['銷售排行', '客群分析', '備註分析']} />
        <SectionBlock title="資料管理" buttons={['商品管理','訂單管理', '備註管理', '人員設定', '權限設定', '系統設定']} />
      </div>
    </div>
  );
};

export default Dashboard;
