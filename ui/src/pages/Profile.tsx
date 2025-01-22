import React, { FC, useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { getProfile, getUserByEmail, giveFriendRequest, ProfileResp } from "../api/profile";
import { useLocation } from "react-router-dom";

interface ProfileProp {
  email? : string
}

export const Profile : FC = () => {
  const [user, setUser] = useState<ProfileResp | null>(null);
  const location = useLocation();
  const data : ProfileProp = location.state;


  useEffect(() => {
    console.log("Inside Profile useEffect")
    const updateProfile = async () => {
      try{
        const profileResp = data.email ?  await getUserByEmail(data.email) : await getProfile() ;
        console.log("profileResp", profileResp);
        setUser(profileResp);
      }catch(err){
        console.log(err);
      }
    }
    updateProfile();
  }, [data.email]);

  const handleFriendRequest = async () => {
    if(data.email) giveFriendRequest(data.email);
  }

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
          {data.email && <button onClick={handleFriendRequest}>Give Friend Req</button>}
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