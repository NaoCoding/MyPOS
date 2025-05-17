import React, { useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Routes, Route, useLocation } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';
import SignUp from './components/signup';

function App() {

  //ToDo token connection with backend api
  const [token, setToken] = useState<string>('');

  if(!token){
    return (
      <div>
        <NextTopLoader color='#565656' showSpinner={false} />
        <Login setToken={setToken} />
        <Routes>
          <Route path="/signup" element={<SignUp/>} /> 
        </Routes>
      </div>
    )
  }


  //ToDo connect to backend to detect role for different routes
  return (
    <div className="app_container">
      <Navbar />
      <NextTopLoader color='#565656' showSpinner={false} />
    </div>
  );
}

export default App;
