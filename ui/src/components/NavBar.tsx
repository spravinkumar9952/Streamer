import React, { FC } from "react";

const NavBar : FC = () => {
  const handleProfileClick = () => {
    
  }
  return (
    <div className="w-screen bg-secondaryBG flex flex-row justify-between items-center">
      <h1 className="font-primaryFont font-bold text-3xl pl-6 py-2">
        STREAMER
      </h1>
      <img src="/png/user.png" alt="user" className="mr-2 w-10 h-10" onClick={handleProfileClick}/>
    </div>
  )
}

export default NavBar;