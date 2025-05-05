import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import './styles/App.css';
import Login from './components/login';

function App() {

  //ToDo token connection with backend api
  var token = false;

  if(!token){
    return <Login />
  }

  return (
    <div className="app_container">
      
    </div>
  );
}

export default App;
