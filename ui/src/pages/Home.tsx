import React, { useState } from "react";
import { FC, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar";
import { PrimaryButton } from "../components/PrimaryButton";


enum Section {
  History,
  Friends,
}

const Home : FC = () => {
  const location = useLocation();
  
  const [selectedSection, setSelectedSection] = useState<Section>(Section.History)

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

  const changeSection = (section : Section) => {
    console.log(section);
    setSelectedSection(section);
  }

  return (
    <>
      <NavBar/>
      <div className="w-screen h-screen bg-primaryBG flex flex-col justify-center items-center">
        <PrimaryButton text="Start Streaming" onClick={handleStartStreaming}/>
        <div className="flex flex-row w-2/3 justify-around m-36">
          <div className="w-1/2" onClick={() => changeSection(Section.History)}>
            <h1 className="font-primaryFont text-2xl text-primaryText">History</h1>
            {selectedSection === Section.History ? <div className="w-full bg-secondaryBG h-1" /> : <div className="w-full bg-secondaryBG h-0.5" />}
          </div>

          <div className="w-1/2" onClick={() => changeSection(Section.Friends) }>
            <h1 className="font-primaryFont text-2xl text-primaryText">Friends</h1>
            {selectedSection === Section.Friends ? <div className="w-full bg-secondaryBG h-1" /> : <div className="w-full bg-secondaryBG h-0.5" />}
          </div>
        </div>

        <div> 
          
        </div>
      </div>
    </>
  )
}


export default Home;