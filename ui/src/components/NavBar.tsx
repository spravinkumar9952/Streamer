import React, { FC, useState } from "react";
import { Friend, getProfile } from "../api/profile";
import { useNavigate } from "react-router-dom";


type NavBarProps = {
  onSearchTextChange?: (event: React.FormEvent<HTMLInputElement>) => void | undefined 
}

const NavBar: FC<NavBarProps> = ({ onSearchTextChange }) => {
  const navigation = useNavigate();
  const [users, setUsers] = useState<null | Friend>(null);

  const onProfileClick = async () => {
    navigation('/profile')
  }

  const onLogoClick = async () => {
    navigation('/');
  }

  return (
    <>
    <div className="w-screen bg-secondaryBG flex flex-row justify-between items-center">
      <h1 className="font-primaryFont font-bold text-3xl pl-6 py-2" onClick={onLogoClick}>
        STREAMER
      </h1>
      <div className="flex flex-row justify-start items-center">
        { onSearchTextChange && <input onChange={onSearchTextChange} className="w-48 h-9 mr-4 p-2 rounded-md" placeholder="Search user"/>}
        <img src="/png/user.png" alt="user" className="mr-2 w-10 h-10" onClick={onProfileClick} />
      </div>
    </div>

    <div className="flex flex-col z-10 items-end rounded-lg">
        <SearchItem name="Pravinkumar S" email="spravinkumar9952@gmail.com"/>
        <SearchItem name="Pravinkumar S" email="spravinkumar9952@gmail.com" />
        <SearchItem name="Pravinkumar S" email="spravinkumar9952@gmail.com" />
        <SearchItem name="Pravinkumar S" email="spravinkumar9952@gmail.com" />
        <SearchItem name="Pravinkumar S" email="spravinkumar9952@gmail.com" />
        <SearchItem name="Pravinkumar S" email="spravinkumar9952@gmail.com" />
    </div>
    </>
  )
}

type SearchItemProps =  {
  name : string 
, email : string 
}

const SearchItem: FC<SearchItemProps> = ({name, email}) => {
  return (
    <div className="flex flex-row p-4 bg-secondaryBG rounded-sm">
      <h1>{name}</h1>
      <h1>{email}</h1>
      <div className="h-1 bg-primaryBG"/>
    </div>
  )
}

export default NavBar;