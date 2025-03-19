import React, { useEffect, useState } from "react";
import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import Home from "./pages/Home";
import { Profile } from "./pages/Profile";
import CreateStreaming from "./pages/CreateStreaming";
import { StreamingRoomPlayer } from "./pages/StreamingRoom";
import { StreamingRoom } from "./api/streamingRoom";

const PageRoute: FC = () => {
    const [initialCompenent, setInitialComponent] = useState<React.JSX.Element>(<LoginPage />);

    useEffect(() => {
        // setInitialComponent(verifyTokenValidity() ? <Home/> : <LoginPage/>);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={initialCompenent} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/createStreaming" element={<CreateStreaming />} />
                <Route path="/streamingRoom/:roomId" element={<StreamingRoomPlayer streamingRoomObj={{ id: "", created_at: new Date().toISOString(), joinedUsers: [], name: "", videoUrl: "", createdBy: "" }} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default PageRoute;
