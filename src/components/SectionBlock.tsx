import React from 'react';
import { useNavigate } from 'react-router-dom';


interface SectionBlockProps {
  title: string;
  buttons: string[];
}

const SectionBlock: React.FC<SectionBlockProps> = ({ title, buttons }) => {
  const navigate = useNavigate();

  const handleClick = (label: string) => {
    // 將按鈕標籤轉成 URL-safe 路徑（支援中文）
    const path = '/' + encodeURIComponent(label);
    navigate(path);
  };

  return (
    <div className="section-block">
      <h2>{title}</h2>
      <div className="button-grid">
        {buttons.map((label, idx) => (
          <button
            key={idx}
            className="menu-button"
            onClick={() => handleClick(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionBlock;
