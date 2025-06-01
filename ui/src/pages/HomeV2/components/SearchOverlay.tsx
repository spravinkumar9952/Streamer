import React from "react";
import { ProfileResp, FriendsListResp, FriendshipStatus } from "../../../api/profile";

interface SearchOverlayProps {
    results: ProfileResp[];
    loading: boolean;
    friends: FriendsListResp | null;
    onAddFriend: (email: string) => Promise<void>;
    onAccept: (email: string) => Promise<void>;
    onClose: () => void;
}

const getMutualFriends = (user: ProfileResp, friends: FriendsListResp | null) => {
    if (!friends) return 0;
    // This is a placeholder. You may want to implement real mutual friend logic if you have more data.
    return friends.friends.filter((f) => f.email !== user.email && f.email !== undefined).length;
};

const SearchOverlay: React.FC<SearchOverlayProps> = ({ results, loading, friends, onAddFriend, onAccept, onClose }) => {
    return (
        <div
            className="absolute left-0 right-0 mt-2 bg-white/90 rounded-2xl shadow-2xl p-6 z-50 flex flex-col gap-2 animate-fade-in"
            style={{ backdropFilter: "blur(8px)" }}
        >
            <div className="flex items-center gap-2 mb-4">
                <svg
                    className="w-6 h-6 text-accent-pink"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="8" stroke="#F7A8C1" strokeWidth="2" />
                    <path d="M21 21l-4-4" stroke="#F7A8C1" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-lg font-semibold text-[#4A4458]">Search Results</span>
            </div>
            {loading ? (
                <div className="text-center text-text-tertiary py-4">Loading...</div>
            ) : results.length === 0 ? (
                <div className="text-center text-text-tertiary py-4">No users found.</div>
            ) : (
                results.map((user) => (
                    <div
                        key={user.email}
                        className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-accent-pink/10 transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] flex items-center justify-center text-white font-bold text-lg">
                                {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </div>
                            <div>
                                <div className="font-semibold text-[#4A4458]">{user.name}</div>
                                <div className="text-[#A084CA] text-sm">@{user.email.split("@")[0]}</div>
                                <div className="text-xs text-accent-pink mt-1">
                                    {getMutualFriends(user, friends)} mutual friends
                                </div>
                            </div>
                        </div>
                        <div>
                            {user.friendshipStatus === FriendshipStatus.NOT_FRIEND && (
                                <button
                                    className="px-5 py-2 rounded-full font-medium text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition"
                                    onClick={() => onAddFriend(user.email)}
                                >
                                    Add Friend
                                </button>
                            )}
                            {user.friendshipStatus === FriendshipStatus.REQUEST_SENT && (
                                <span className="px-5 py-2 rounded-full font-medium text-[#F7A8C1] bg-accent-pink/10 cursor-not-allowed">
                                    Request Sent
                                </span>
                            )}
                            {user.friendshipStatus === FriendshipStatus.REQUEST_RECEIVED && (
                                <button
                                    className="px-5 py-2 rounded-full font-medium text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition"
                                    onClick={() => onAccept(user.email)}
                                >
                                    Accept
                                </button>
                            )}
                            {user.friendshipStatus === FriendshipStatus.FRIEND && (
                                <span className="px-5 py-2 rounded-full font-medium text-[#A084CA] bg-[#F7E6A8]/30 cursor-not-allowed">
                                    Friend
                                </span>
                            )}
                            {user.friendshipStatus === FriendshipStatus.YOU && (
                                <span className="px-5 py-2 rounded-full font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                                    You
                                </span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SearchOverlay;
