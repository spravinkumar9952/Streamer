import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    getSearchResult,
    getFriendsList,
    giveFriendRequest,
    ProfileResp,
    FriendsListResp,
    acceptFriendRequest,
} from "../../../api/profile";
import SearchOverlay from "./SearchOverlay";
import AuthContext from "../../../contexts/Auth";

export const NavBarV2: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<ProfileResp[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [friends, setFriends] = useState<FriendsListResp | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { user: authUser } = useContext(AuthContext);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    useEffect(() => {
        getFriendsList()
            .then((f) => setFriends(f))
            .catch((err) => {
                console.error("Error fetching friends list:", err);
            });
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setResults([]);
            return;
        }
        setLoading(true);
        getSearchResult(search)
            .then((resp) => setResults(resp.list))
            .finally(() => setLoading(false));
    }, [search]);

    const handleAddFriend = async (email: string) => {
        giveFriendRequest(email).then(() => {
            getFriendsList().then((resp) => setFriends(resp));
            getSearchResult(search).then((resp) => setResults(resp.list));
        });
    };

    const onProfileClick = () => {
        console.log("onProfileClick", authUser);
        navigate("/profile", { state: { email: authUser?.email } });
    };

    return (
        <nav className="sticky top-0 z-30 w-full bg-[#4A4458] shadow-lg py-2 px-2 md:py-3 md:px-6 flex items-center justify-between rounded-b-2xl">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 md:gap-3">
                <img src="/png/ic_logo.png" alt="Streamer Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                <span className="text-lg md:text-2xl font-bold text-white">Streamer</span>
            </div>
            {/* Search (hidden on mobile, show as icon) */}
            <div className="flex-1 flex justify-center relative">
                <div className="w-full max-w-xl hidden md:block">
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Search for friends..."
                        className="w-full px-5 py-2 rounded-full border border-border-light bg-background-tertiary text-white focus:outline-none focus:ring-2 focus:ring-accent-pink placeholder:text-gray-300"
                    />
                    {isFocused && search && (
                        <SearchOverlay
                            results={results}
                            loading={loading}
                            friends={friends}
                            onAddFriend={handleAddFriend}
                            onAccept={acceptFriendRequest}
                            onClose={() => setIsFocused(false)}
                        />
                    )}
                </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-5">
                {/* Mobile search icon */}
                <button className="block md:hidden text-white ml-2" onClick={() => setMobileSearchOpen(true)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
                <button
                    className="px-3 py-1 md:px-5 md:py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#A084CA] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#A084CA] transition text-sm md:text-base"
                    onClick={() => navigate("/createStreaming")}
                >
                    Create
                </button>
                {/* Profile Icon */}
                <button onClick={onProfileClick}>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent-pink/30 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
                            />
                        </svg>
                    </div>
                </button>
            </div>
            {mobileSearchOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex flex-col items-start">
                    <div className="bg-[#232323] rounded-b-lg w-full max-w-md mx-auto p-4 pt-6">
                        <div className="flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                                placeholder="Search for friends..."
                                className="w-full px-4 py-2 rounded-full border border-border-light bg-background-tertiary text-white focus:outline-none focus:ring-2 focus:ring-accent-pink placeholder:text-gray-300"
                            />
                            <button className="ml-2 text-white text-2xl" onClick={() => setMobileSearchOpen(false)}>
                                ✕
                            </button>
                        </div>
                        {/* Show results below input */}
                        {search && (
                            <div className="mt-4">
                                <SearchOverlay
                                    results={results}
                                    loading={loading}
                                    friends={friends}
                                    onAddFriend={handleAddFriend}
                                    onAccept={acceptFriendRequest}
                                    onClose={() => setMobileSearchOpen(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBarV2;
