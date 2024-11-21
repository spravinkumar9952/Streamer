import React, { FC } from "react";
import { getProfile } from "../api/profile";
import { useNavigate } from "react-router-dom";

const NavBar : FC = () => {
  const navigation = useNavigate();

  const onProfileClick = async () => {
    navigation('/profile')
  }

  const onLogoClick = async () => {
    navigation('/');
  }

  return (
    <div className="w-screen bg-secondaryBG flex flex-row justify-between items-center">
      <h1 className="font-primaryFont font-bold text-3xl pl-6 py-2" onClick={onLogoClick}>
        STREAMER
      </h1>
      <img src="/png/user.png" alt="user" className="mr-2 w-10 h-10" onClick={onProfileClick}/>
    </div>
  )
}

export default NavBar;