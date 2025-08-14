import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/user/Home';
import './App.css';
import Login from './pages/login/Login';
import AdminHome from './pages/admin/AdminHome.jsx';
import AddQuestion from './pages/admin/AddQuestions.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/AdminHome' element={<AdminHome/>} />
        <Route path="/admin/add" element={<AddQuestion />} />
      </Routes>
    </BrowserRouter>
  )
}
