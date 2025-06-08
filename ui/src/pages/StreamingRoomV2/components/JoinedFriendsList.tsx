import React from "react";
import { FiUser } from "react-icons/fi";

interface Friend {
    name: string;
    username: string;
    status: string;
}

interface JoinedFriendsListProps {
    friends: Friend[];
}

const JoinedFriendsList: React.FC<JoinedFriendsListProps> = ({ friends }) => {
    return (
        <div className="bg-white/80 rounded-2xl border border-pink-100 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Friends in Room</h3>
            <div className="space-y-3">
                {friends.map((friend, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <FiUser className="text-pink-400" size={20} />
                            </div>
                            <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                    friend.status === "Watching" ? "bg-green-400" : "bg-yellow-400"
                                }`}
                            />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                            <p className="text-sm font-medium text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                                {friend.name}
                            </p>
                            <p className="text-xs text-gray-500 break-all max-w-[180px]">{friend.username}</p>
                        </div>
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                                friend.status === "Watching"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-yellow-100 text-yellow-600"
                            }`}
                        >
                            {friend.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JoinedFriendsList;
