import React, { useState } from "react";
import { FC, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar";
import { PrimaryButton } from "../components/PrimaryButton";
import { acceptFriendRequest, Friend, FriendsListResp, getFriendsList, getSearchResult } from "../api/profile";
import exp from "constants";


enum Section {
  History,
  Friends,
}

const Home: FC = () => {
  const location = useLocation();

  const [selectedSection, setSelectedSection] = useState<Section>(Section.History)
  const [friends, setFriends] = useState<FriendsListResp | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const email = params.get('email');
    const token = params.get('token');

    localStorage.setItem('authToken', token ?? "");

    console.log("params " + name + " " + email + " " + token);
  }, []);


  const handleStartStreaming = () => {

  }

  const changeSection = async (section: Section) => {
    setSelectedSection(section);

    if (section === Section.Friends) {
      try {
        const resp = await getFriendsList();
        console.log(resp);
        setFriends(resp);
      } catch (err) {

      }
    }
  }

  return (
    <div className="bg-primaryBG">
      <NavBar />
      <div className="w-screen h-screen bg-primaryBG flex flex-col justify-center items-center">
        <PrimaryButton text="Start Streaming" onClick={handleStartStreaming} />
        <div className="flex flex-row w-2/3 justify-around mt-36 mb-3">
          <div className="w-1/2" onClick={() => changeSection(Section.History)}>
            <h1 className="font-primaryFont text-2xl text-primaryText">History</h1>
            {selectedSection === Section.History ? <div className="w-full bg-secondaryBG h-1" /> : <div className="w-full bg-secondaryBG h-0.5" />}
          </div>

          <div className="w-1/2" onClick={() => changeSection(Section.Friends)}>
            <h1 className="font-primaryFont text-2xl text-primaryText">Friends</h1>
            {selectedSection === Section.Friends ? <div className="w-full bg-secondaryBG h-1" /> : <div className="w-full bg-secondaryBG h-0.5" />}
          </div>
        </div>

        {selectedSection === Section.Friends
          ?
          <>
            <>
              <h1 className="font-primaryFont text-primaryText text-xl mt-3">Request</h1>
              {friends?.friendRequests.map(item => <FriendItemView friend={item} showAccept={true} />)}
            </>

            <>
              <h1 className="font-primaryFont text-primaryText text-xl mt-3">Accepted</h1>
              {friends?.friends.map(item => <FriendItemView friend={item} />)}
            </>
          </>
          :
          <div>

          </div>
        }
      </div>
    </div>
  )
}



type SearchItemsProps = {
  name: string
}

const SearchItems: FC<SearchItemsProps> = ({ name }) => {
  return (
    <div className="w-2/3 bg-secondaryBG flex flex-row justify-start p-5 mx-2 rounded-lg items-center">
      <img src="/png/users.png" alt="users" className="w-11 h-11" />
      <h1 className="font-primaryFont text-secondaryText text-xl ml-5">{name}</h1>
    </div>
  )
}


type FriendItemViewProps = {
  friend: Friend,
  showAccept?: boolean;
}

const FriendItemView: FC<FriendItemViewProps> = ({ friend, showAccept }) => {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  const handleOnAcceptClick = () => {
    acceptFriendRequest(friend.email).then(res => {
      setAccepted(true);
    }).catch(err => setAccepted(false));
  }

  return (
    <div className="w-2/3 bg-secondaryBG flex flex-row justify-between p-5 mx-2 rounded-lg items-center" >
      <div className="flex flex-row">
        <img src="/png/users.png" alt="users" className="w-11 h-11" />
        <h1 className="font-primaryFont text-secondaryText text-xl ml-5">{friend.name}</h1>
      </div>
      <div>
        {showAccept && <div onClick={handleOnAcceptClick}>{accepted === null ? "Accept" : accepted ? "Accepted" : "Rejected"}</div>}
      </div>
    </div >
  )
}


export default Home;