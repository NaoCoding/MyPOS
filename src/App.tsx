import React, { useState , useEffect } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route, useLocation } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';
import SignUp from './components/signup';

function App() {

  //ToDo token connection with backend api
  const [token, setToken] = useState<string>('');

  const [roleId, setRoleId] = useState<number>(0);

  useEffect(() => {
    if (token) {
      fetchUserRole(token).then(setRoleId);
    }
  }, [token]);


  const fetchUserRole = async (token: string) => {
    try {

      

      const response = await fetch('http://localhost:5000/role/getRole', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User role_id:', data.role_id);
        return data.role_id;
      } else {
        console.error('Failed to fetch user role');
        return 0;
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 0;
    }
  };
  
  //console.log('token:', token);

  if(!token){
    return (
      <div>
        <NextTopLoader color='#565656' showSpinner={false} />
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<SignUp/>} /> 
        </Routes>
      </div>
    )
  }


  //ToDo connect to backend to detect role for different routes
  return (
    <div className="app_container">
      <Navbar role_id={roleId}/>
      <NextTopLoader color='#565656' showSpinner={false} />
    </div>
  );
}

export default App;
