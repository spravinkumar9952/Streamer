import React, { useEffect, useState } from "react";
import { FC } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import { Profile } from "./pages/Profile";
import CreateStreaming from "./pages/CreateStreaming";
import { StreamingRoomPlayer } from "./pages/StreamingRoom";
import { StreamingRoom } from "./api/streamingRoom";
import { getProfile } from "./api/profile";
import HomeV2 from "./pages/HomeV2/Page";
import LandingPage from "./pages/LandingPage/Page";

const PageRoute: FC = () => {
    const [initialCompenent, setInitialComponent] = useState<React.JSX.Element>(<LandingPage />);

    useEffect(() => {
        const currentToken = localStorage.getItem("authToken");
        if (currentToken) {
            setInitialComponent(<HomeV2 />);
        } else {
            setInitialComponent(<LandingPage />);
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={initialCompenent} />
                <Route path="/login" element={<LandingPage />} />
                <Route path="/home" element={<HomeV2 />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/createStreaming" element={<CreateStreaming />} />
                <Route
                    path="/streamingRoom/:roomId"
                    element={
                        <StreamingRoomPlayer
                            streamingRoomObj={{
                                id: "",
                                created_at: new Date().toISOString(),
                                joinedUsers: [],
                                name: "",
                                videoUrl: "",
                                createdBy: "",
                            }}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default PageRoute;
