import React, { FC, useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { getProfile, ProfileResp } from "../api/profile";


export const Profile = () => {
  const [user, setUser] = useState<ProfileResp | null>(null);


  useEffect(() => {
    const updateProfile = async () => {
      try{
        const profileResp = await getProfile();
        setUser(profileResp);
      }catch(err){
        console.log(err);
      }
    }
    updateProfile();
  }, []);

  return (
    <>
      <NavBar/>
      <div className="w-screen h-screen bg-primaryBG flex flex-col items-center justify-center">
        <div className="w-fit h-fit bg-secondaryBG p-24 rounded-md flex flex-col justify-center items-center">
          <img src="./png/user.png" className="w-28 h-28"/>
          <div className="flex flex-col justify-start">
            <KeyValView label="Name:" val={user?.name ?? "NA"} />
            <KeyValView label="Email:" val={user?.email ?? "NA"} />
          </div>
        </div>
      </div>
    </>
  )
}

type KeyValViewProps = {
  label : string,
  val : string
}

const KeyValView: FC<KeyValViewProps> = ({ label, val}) => {
  console.log("Inside KeyValView")
  return (
    <div className="flex flex-row mt-10">
      <h1 className="text-tertiaryText font-primaryFont text-4xl">{label}</h1>
      <h1 className="text-secondaryText font-primaryFont text-4xl ml-6">{val}</h1>
    </div>
  )
}