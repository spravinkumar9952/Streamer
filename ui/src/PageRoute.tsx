import React, { useEffect, useState } from "react";
import { FC } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from "./pages/Login";
import Home from "./pages/Home";
import { Profile } from "./pages/Profile";
import CreateStreaming from "./pages/CreateStreaming";

const PageRoute : FC = () => {
  const [initialCompenent, setInitialComponent] = useState <React.JSX.Element>(<LoginPage/>)

  useEffect(() => {
    // setInitialComponent(verifyTokenValidity() ? <Home/> : <LoginPage/>);
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={initialCompenent}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/createStreaming" element={<CreateStreaming/>}/>
      </Routes>
    </BrowserRouter>  
  )
}

export default PageRoute;