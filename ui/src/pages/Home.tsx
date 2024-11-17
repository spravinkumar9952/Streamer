import React from "react";
import { FC, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar";


const Home : FC = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const email = params.get('email');
    console.log("params " + name + " " + email);
  }, []);

  return (
    <>
      <NavBar/>
      <div className="w-screen h-screen bg-primaryBG">
        <h1>Home</h1>
      </div>
    </>
  )
}


export default Home;