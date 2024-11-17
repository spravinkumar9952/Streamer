import React from "react";
import { FC } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from "./pages/Login";
import Home from "./pages/Home";

const PageRoute : FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </BrowserRouter>  
  )
}

export default PageRoute;