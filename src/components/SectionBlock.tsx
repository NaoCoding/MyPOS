import React from 'react';
import { useNavigate } from 'react-router-dom';


// 按鈕型別：顯示中文、導向英文路由
interface Button {
  label: string;
  path: string;
}

interface SectionBlockProps {
  title: string;
  buttons: Button[];
}

const SectionBlock: React.FC<SectionBlockProps> = ({ title, buttons }) => {
  const navigate = useNavigate();

  return (
    <div className="section-block">
      <h2>{title}</h2>
      <div className="button-grid">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            className="menu-button"
            onClick={() => navigate(btn.path)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionBlock;
