import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';
import Navbar from './components/nav';

function App() {

  //ToDo token connection with backend api
  var token = false;

  if(!token){
    return <Login />
  }

  return (
    <div className="app_container">
      <Navbar />
    </div>
  );
}

export default App;
