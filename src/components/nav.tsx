import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../styles/nav.css";

interface NavbarProps {
  role_id: number;
  setToken: React.Dispatch<React.SetStateAction<string>>; // 新增 setToken 作為 props
}

export default function Navbar({ role_id, setToken }: NavbarProps) {
  role_id = role_id || 0; // Default to 0 if role_id is not provided

  console.log("role_id:", role_id);

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // 重要：包含 httpOnly cookies
      });

      if (response.ok) {
        console.log('Logged out successfully');
        setToken(''); // 清除應用程式中的 token 狀態
        window.location.href = '/login'; 
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (role_id === 1) {
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          MyPos
        </Link>
        <ul>
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/history">Order History</CustomLink>
          <CustomLink to="/setting">Setting</CustomLink>
          <li>
            <button onClick={logout} className="logout-button">Logout</button> {/* 修改為按鈕 */}
          </li>
        </ul>
      </nav>
    );
  }

  else if (role_id === 4) {
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          MyPos
        </Link>
        <ul>
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/manage/user">User Management</CustomLink>
          <li>    
            <button onClick={logout} className="logout-button">Logout</button> {/* 修改為按鈕 */}
          </li>
        </ul>
      </nav>
    );

  }

  return null;
}

function CustomLink({ to, children, onClick = () => {}, ...props }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""} onClick={onClick}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}