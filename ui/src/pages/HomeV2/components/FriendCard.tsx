import React from "react";
import { CloseIcon } from "../svg/CloseIcon";
import { Friend } from "../../../api/profile";
import { useNavigate } from "react-router-dom";

type FriendCardProps = {
    name: string;
    username: string;
    initials: string;
    color: string;
    online: boolean;
    onUnfriend: () => void;
    friend: Friend;
};

export const FriendCard: React.FC<FriendCardProps> = ({
    name,
    username,
    initials,
    color,
    online,
    onUnfriend,
    friend,
}) => {
    const navigate = useNavigate();
    const onProfileClick = () => {
        navigate(`/profile`, { state: { email: friend.email } });
    };
    return (
        <div className="flex items-center justify-between bg-[#3B2A4A] rounded-2xl p-4 shadow mb-2 transform transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center gap-4 mr-6 cursor-pointer" onClick={onProfileClick}>
                <div className="relative">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ background: color }}
                    >
                        {initials}
                    </div>
                    <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#4A3A5A] ${
                            online ? "bg-[#F7A8C1]" : "bg-gray-500"
                        }`}
                    ></span>
                </div>
                <div>
                    <div className="font-semibold text-white mr-2">{name}</div>
                    {/* <div className="text-gray-200 text-sm">
                    @{username}{" "}
                    {online ? (
                        <span className="text-[#FFB6E6] ml-1 font-semibold">Online</span>
                    ) : (
                        <span className="text-gray-400 ml-1">Offline</span>
                    )}
                </div> */}
                </div>
            </div>
            <button
                onClick={onUnfriend}
                className="p-1 rounded-full font-medium text-gray-100 bg-gradient-to-r from-[#A084CA] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#A084CA]"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export default FriendCard;
