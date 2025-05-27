import React, { FC, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { getProfile, getUserByEmail, giveFriendRequest, ProfileResp } from "../api/profile";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/Auth";
import { useContext } from "react";
import { FriendshipStatus } from "../api/profile";

export const Profile: FC = () => {
    const [user, setUser] = useState<ProfileResp | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user: authUser, setUser: setAuthUser } = useContext(AuthContext);
    const data: ProfileResp | undefined = location.state;

    const updateProfile = async () => {
        try {
            setIsLoading(true);
            const profileResp = data && data.email ? await getUserByEmail(data.email) : await getProfile();
            setUser(profileResp);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updateProfile();
    }, [data, data?.email]);

    const handleFriendRequest = async () => {
        if (data?.email && user?.friendshipStatus !== FriendshipStatus.NOT_FRIEND) {
            try {
                await giveFriendRequest(data.email);
                await updateProfile();
            } catch (err) {
                console.error("Error sending friend request:", err);
                setError("Failed to send friend request");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setAuthUser(null);
        navigate("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (!authUser) {
        return (
            <div className="min-h-screen bg-background-primary">
                <NavBar showSearch={false} />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-md mx-auto">
                        <div className="bg-background-card rounded-card shadow-card p-8 text-center space-y-6">
                            <h2 className="text-2xl font-bold text-text-primary">Please Log In</h2>
                            <p className="text-text-secondary">You need to be logged in to view profiles.</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-3 px-6 rounded-button font-medium bg-button-primary-background hover:bg-button-primary-hover text-button-primary-text transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background-card"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="text-status-error text-center">
                    <p className="text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-primary">
            <NavBar showSearch={false} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-background-card rounded-card shadow-card p-8 space-y-8">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <img
                                    src="/png/user.png"
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-border-light object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-status-online rounded-full border-2 border-background-card"></div>
                            </div>

                            <div className="mt-6 space-y-6 w-full">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-tertiary">Name</label>
                                    <p className="text-xl font-semibold text-text-primary">
                                        {user?.name ?? "Not Available"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-tertiary">Email</label>
                                    <p className="text-xl font-semibold text-text-primary">
                                        {user?.email ?? "Not Available"}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                {data?.email &&
                                    user?.friendshipStatus &&
                                    user?.friendshipStatus === FriendshipStatus.NOT_FRIEND && (
                                        <button
                                            onClick={handleFriendRequest}
                                            className="w-full py-3 px-6 rounded-button font-medium bg-button-primary-background hover:bg-button-primary-hover text-button-primary-text transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background-card"
                                        >
                                            {getButtonText(user?.friendshipStatus)}
                                        </button>
                                    )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 px-6 rounded-button font-medium bg-background-secondary hover:bg-background-tertiary text-text-primary transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-border-light focus:ring-offset-2 focus:ring-offset-background-card mt-4"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getButtonText = (friendshipStatus: FriendshipStatus): string => {
    switch (friendshipStatus) {
        case FriendshipStatus.FRIEND:
            return "Remove Friend";
        case FriendshipStatus.REQUEST_SENT:
            return "Cancel Friend Request";
        case FriendshipStatus.REQUEST_RECEIVED:
            return "Accept Friend Request";
        case FriendshipStatus.NOT_FRIEND:
            return "Send Friend Request";
        case FriendshipStatus.YOU:
            return "You";
        default:
            return "Unknown";
    }
};

export default Profile;

type KeyValViewProps = {
    label: string;
    val: string;
};

const KeyValView: FC<KeyValViewProps> = ({ label, val }) => {
    console.log("Inside KeyValView");
    return (
        <div className="flex flex-row mt-10">
            <h1 className="text-tertiaryText font-primaryFont text-4xl">{label}</h1>
            <h1 className="text-secondaryText font-primaryFont text-4xl ml-6">{val}</h1>
        </div>
    );
};
