import React, { useEffect, useState } from "react";
import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Profile } from "./pages/Profile";
import CreateStreaming from "./pages/CreateStreaming";
import { StreamingRoomPlayer } from "./pages/StreamingRoom";
import { StreamingRoom } from "./api/streamingRoom";
import { getProfile } from "./api/profile";
import HomeV2 from "./pages/HomeV2/Page";
import LandingPage from "./pages/LandingPage/Page";
import ProfileV2 from "./pages/ProfileV2/Page";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/Auth";

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
            <AuthProvider>
                <Routes>
                    <Route path="/" element={initialCompenent} />
                    <Route path="/login" element={<LandingPage />} />
                    <Route path="/home" element={<HomeV2 />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfileV2 />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/createStreaming"
                        element={
                            <ProtectedRoute>
                                <CreateStreaming />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/streamingRoom/:roomId"
                        element={
                            <ProtectedRoute>
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
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default PageRoute;
