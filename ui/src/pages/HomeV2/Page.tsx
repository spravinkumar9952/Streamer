import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBarV2 } from "./components/NavBarV2";
import { SectionTabsV2, SectionV2 } from "./components/SectionTabsV2";
import { RoomCard } from "./components/RoomCard";
import { FriendRequestCard } from "./components/FriendRequestCard";
import { FriendCard } from "./components/FriendCard";
import { getStreamingRoomsList, StreamingRoom } from "../../api/streamingRoom";
import {
    getFriendsList,
    FriendsListResp,
    Friend,
    FriendRequest,
    acceptFriendRequest,
    getProfile,
    unfriend,
    deleteFriendRequest,
} from "../../api/profile";
import AuthContext from "../../contexts/Auth";
import HeartIcon from "./svg/HeartIcon";
import FriendsIcon from "./svg/FriendsIcon";

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}
const pastelColors = ["#F7A8C1", "#C6B6F7", "#F7E6A8", "#A8E6CF", "#FFD3B6", "#B6E0FE"];

function getYouTubeThumbnail(url: string | undefined): string | null {
    if (!url) return null;
    const match = url.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/
    );
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

// Helper to extract YouTube video ID
function extractYouTubeId(url: string | undefined): string | null {
    if (!url) return null;
    const match = url.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
}

// Helper to fetch YouTube video details
async function fetchYouTubeDetails(videoId: string, apiKey: string) {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.items || !data.items[0]) return null;
    const snippet = data.items[0].snippet;
    return {
        title: snippet.title,
        channel: snippet.channelTitle,
        description: snippet.description,
    };
}

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || "";

export const HomeV2: React.FC = () => {
    const location = useLocation();
    const navigation = useNavigate();
    const { setUser, user } = useContext(AuthContext);
    const [selectedSection, setSelectedSection] = useState<SectionV2>(SectionV2.Rooms);
    const [rooms, setRooms] = useState<StreamingRoom[]>([]);
    const [friends, setFriends] = useState<FriendsListResp | null>(null);
    const [loading, setLoading] = useState(false);

    // Params/auth logic
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const name = params.get("name");
        const email = params.get("email");
        const token = params.get("token");

        const checkOldTokenValidity = (newToken: string | null): boolean => {
            const currentToken = localStorage.getItem("authToken");
            if (newToken == null && currentToken) {
                getProfile()
                    .then((profileResp) => {
                        setUser({ email: profileResp.email, name: profileResp.name, picture: "" });
                    })
                    .catch(() => {
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
            setUser({ email: email ?? "", name: name ?? "", picture: "" });
        };

        if (!checkOldTokenValidity(token)) {
            checkNewTokenValidity(name, email, token);
        }
    }, [location.search]);

    useEffect(() => {
        setLoading(true);
        if (selectedSection === SectionV2.Rooms) {
            getStreamingRoomsList({})
                .then((resp: { list: StreamingRoom[] }) => setRooms(resp.list))
                .catch((err) => {
                    console.error("Error fetching streaming rooms list:", err);
                })
                .finally(() => setLoading(false));
        } else {
            getFriendsList()
                .then((resp: FriendsListResp) => setFriends(resp))
                .catch((err) => {
                    console.error("Error fetching friends list:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [selectedSection]);

    const handleUnfriend = (email: string) => async () => {
        try {
            await unfriend(email);
            const updated = await getFriendsList();
            setFriends(updated);
        } catch (err) {
            alert("Failed to unfriend. Please try again.");
        }
    };

    const handleDeleteFriendRequest = (email: string) => async () => {
        try {
            await deleteFriendRequest(email);
            const updated = await getFriendsList();
            setFriends(updated);
        } catch (err) {
            alert("Failed to delete friend request. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-background-primary">
            <NavBarV2 />
            <div className="container mx-auto px-4 py-8">
                <SectionTabsV2 selected={selectedSection} onSelect={setSelectedSection} />
                <div className="mt-8">
                    {loading ? (
                        <div className="text-center text-text-tertiary py-12">Loading...</div>
                    ) : selectedSection === SectionV2.Rooms ? (
                        <div
                            className="grid gap-x-8 gap-y-8 w-full"
                            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
                        >
                            {rooms.map((room: StreamingRoom, idx: number) => (
                                <RoomCard
                                    key={room.id}
                                    title={room.name}
                                    subtitle={room.videoUrl ? `Now watching: ${room.videoUrl}` : "No video"}
                                    status={room.joinedUsers.length > 0 ? "Live" : "Offline"}
                                    viewers={room.joinedUsers.length}
                                    avatars={room.joinedUsers.slice(0, 2).map((email: string, i: number) => ({
                                        initials: getInitials(email),
                                        color: pastelColors[i % pastelColors.length],
                                    }))}
                                    thumbnail={getYouTubeThumbnail(room.videoUrl)}
                                    onJoin={() => navigation(`/streamingRoom/${room.id}`, { state: { room } })}
                                    createdBy={room.createdBy}
                                />
                            ))}
                        </div>
                    ) : friends ? (
                        <div className="space-y-8">
                            {friends.friendRequests.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <HeartIcon className="w-6 h-6 text-accent-pink" />
                                        <span className="text-lg font-semibold text-white">Friend Requests</span>
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#A084CA] to-[#C6B6F7] text-white text-xs font-semibold">
                                            {friends.friendRequests.length}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {friends.friendRequests.map((req: FriendRequest, idx: number) => (
                                            <FriendRequestCard
                                                key={req.email}
                                                name={req.name}
                                                username={req.email.split("@")[0]}
                                                initials={getInitials(req.name)}
                                                color={pastelColors[idx % pastelColors.length]}
                                                onAccept={() =>
                                                    acceptFriendRequest(req.email).then(() => window.location.reload())
                                                }
                                                onDecline={handleDeleteFriendRequest(req.email)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <FriendsIcon className="w-8 h-8 text-accent-pink" />
                                    <span className="text-lg font-semibold text-white">Your Friends</span>
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#A084CA] to-[#C6B6F7] text-white text-xs font-semibold">
                                        {friends.friends.length}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    {friends.friends.map((friend: Friend, idx: number) => (
                                        <FriendCard
                                            key={friend.email}
                                            name={friend.name}
                                            username={friend.email.split("@")[0]}
                                            initials={getInitials(friend.name)}
                                            color={pastelColors[idx % pastelColors.length]}
                                            friend={friend}
                                            online={true}
                                            onUnfriend={handleUnfriend(friend.email)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default HomeV2;
