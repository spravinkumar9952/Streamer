import React, { useContext, useState } from "react";
import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { PrimaryButton } from "../components/PrimaryButton";
import {
    acceptFriendRequest,
    Friend,
    FriendsListResp,
    getFriendsList,
    getProfile,
    getSearchResult,
} from "../api/profile";
import { getStreamingRoomsList, StreamingRoom } from "../api/streamingRoom";
import { StreamingRoomListItem } from "../components/StreamingRoomListItem";
import AuthContext, { User } from "../contexts/Auth";

enum Section {
    StreamingRooms,
    Friends,
}

const Home: FC = () => {
    const location = useLocation();
    const [selectedSection, setSelectedSection] = useState<Section>(Section.StreamingRooms);
    const [friends, setFriends] = useState<FriendsListResp | null>(null);
    const [streamingRooms, setStreamingRooms] = useState<StreamingRoom[]>([]);
    const navigation = useNavigate();
    const { setUser, user } = useContext(AuthContext);

    const checkOldTokenValidity = (newToken: string | null): boolean => {
        const currentToken = localStorage.getItem("authToken");
        console.log("currentToken", currentToken);
        console.log("token", newToken);
        if (newToken == null && currentToken) {
            console.log("inside if");
            getProfile()
                .then((profileResp) => {
                    console.log("profileResp", profileResp);
                    changeSection(Section.StreamingRooms);
                    setUser({ email: profileResp.email, name: profileResp.name, profilePicture: "" });
                })
                .catch((err) => {
                    console.error("Error fetching profile:", err);
                    navigation("/login");
                });
            return true;
        }
        return false;
    };

    const checkNewTokenValidity = (name: string | null, email: string | null, token: string | null) => {
        if (!name || !email || !token) {
            const token = localStorage.getItem("authToken");
            if (!user?.email || !user?.name || !token) {
                navigation("/login");
                return;
            }
            return;
        }
        localStorage.setItem("authToken", token ?? "");
        changeSection(Section.StreamingRooms);
        setUser({ email: email ?? "", name: name ?? "", profilePicture: "" });
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const name = params.get("name");
        const email = params.get("email");
        const token = params.get("token");

        if (!checkOldTokenValidity(token)) {
            checkNewTokenValidity(name, email, token);
        }
    }, [location.search]);

    const handleStartStreaming = () => {
        navigation("/createStreaming");
    };

    const changeSection = async (section: Section) => {
        setSelectedSection(section);

        if (section === Section.Friends) {
            getFriendsList()
                .then((resp) => {
                    setFriends(resp);
                })
                .catch((err) => {
                    console.error("Error fetching friends list:", err);
                });
        } else if (section === Section.StreamingRooms) {
            getStreamingRoomsList({}).then((resp) => {
                if (resp.list) {
                    setStreamingRooms(resp.list);
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-background-primary">
            <NavBar showSearch={true} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center mb-12">
                    <button
                        onClick={handleStartStreaming}
                        className="bg-button-primary-background hover:bg-button-primary-hover text-button-primary-text px-8 py-4 rounded-button shadow-card transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                    >
                        <span className="text-lg font-medium">Start Streaming</span>
                    </button>
                </div>

                <div className="flex justify-center space-x-8 mb-8">
                    <button onClick={() => changeSection(Section.StreamingRooms)} className="relative group">
                        <h2
                            className={`text-2xl font-medium transition-colors duration-200 ${
                                selectedSection === Section.StreamingRooms
                                    ? "text-text-primary"
                                    : "text-text-tertiary hover:text-text-primary"
                            }`}
                        >
                            Streaming Rooms
                        </h2>
                        <div
                            className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-200 ${
                                selectedSection === Section.StreamingRooms
                                    ? "bg-secondary-light scale-x-100"
                                    : "bg-border-light scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                    </button>

                    <button onClick={() => changeSection(Section.Friends)} className="relative group">
                        <h2
                            className={`text-2xl font-medium transition-colors duration-200 ${
                                selectedSection === Section.Friends
                                    ? "text-text-primary"
                                    : "text-text-tertiary hover:text-text-primary"
                            }`}
                        >
                            Friends
                        </h2>
                        <div
                            className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-200 ${
                                selectedSection === Section.Friends
                                    ? "bg-secondary-light scale-x-100"
                                    : "bg-border-light scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                    </button>
                </div>

                <div className="space-y-8">
                    {selectedSection === Section.Friends && (
                        <>
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium text-text-primary">Friend Requests</h3>
                                <div className="space-y-4">
                                    {friends?.friendRequests.map((item) => (
                                        <FriendItemView key={item.email} friend={item} showAccept={true} />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-medium text-text-primary">Friends</h3>
                                <div className="space-y-4">
                                    {friends?.friends.map((item) => (
                                        <FriendItemView key={item.email} friend={item} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {selectedSection === Section.StreamingRooms && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {streamingRooms.map((item) => (
                                <StreamingRoomListItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

type FriendItemViewProps = {
    friend: Friend;
    showAccept?: boolean;
};

const FriendItemView: FC<FriendItemViewProps> = ({ friend, showAccept }) => {
    const [accepted, setAccepted] = useState<boolean | null>(null);

    const handleOnAcceptClick = () => {
        acceptFriendRequest(friend.email)
            .then((res) => {
                setAccepted(true);
            })
            .catch((err) => setAccepted(false));
    };

    return (
        <div className="bg-background-card rounded-card shadow-card hover:shadow-lg transition-all duration-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src="/png/users.png"
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-border-light"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-online rounded-full border-2 border-background-card"></div>
                </div>
                <div>
                    <h2 className="font-medium text-text-primary text-lg">{friend.name}</h2>
                    <p className="text-sm text-text-tertiary">{friend.email}</p>
                </div>
            </div>

            {showAccept && (
                <button
                    onClick={handleOnAcceptClick}
                    disabled={accepted !== null}
                    className={`px-6 py-2 rounded-button font-medium transition-all duration-200 ${
                        accepted === null
                            ? "bg-button-primary-background hover:bg-button-primary-hover text-button-primary-text"
                            : accepted
                            ? "bg-status-success text-text-primary cursor-not-allowed"
                            : "bg-status-error text-text-primary cursor-not-allowed"
                    }`}
                >
                    {accepted === null ? "Accept" : accepted ? "Accepted" : "Rejected"}
                </button>
            )}
        </div>
    );
};

export default Home;
