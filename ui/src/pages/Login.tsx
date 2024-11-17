import React from "react";
import { FC } from "react";
import  '../index.css';
import NavBar from "../components/NavBar";
import { authGoogle } from "../api/auth";



export const LoginPage : FC = () => {
  const handleGoogleLogin = () => {
    authGoogle();
  }
  return(
    <>
    <NavBar/>
    <div className="w-screen h-screen bg-primaryBG flex flex-col items-center justify-center">
        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <div className="bg-secondaryBG w-fit h-fit flex flex-row justify-center items-center px-4 py-3 rounded-lg" onClick={handleGoogleLogin}>
            <img src="/png/google.png" className="w-16"/>
            <h1 className="font-primaryFont text-3xl text-secondaryText pl-2" >
              Login with Google
            </h1>
          </div>
      </div>
    </div>
    </>
  )
}