import React from "react";

type FriendRequestCardProps = {
    name: string;
    username: string;
    initials: string;
    color: string;
    onAccept: () => void;
    onDecline: () => void;
};

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
    name,
    username,
    initials,
    color,
    onAccept,
    onDecline,
}) => (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#F7A8C1]/40 to-[#C6B6F7]/30 rounded-2xl p-5 shadow-lg mb-4 border border-[#F7A8C1]/20">
        <div className="flex items-center gap-4">
            <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ background: color }}
            >
                {initials}
            </div>
            <div>
                <div className="font-semibold text-white text-lg drop-shadow-sm">{name}</div>
                <div className="text-[#FFD3B6] text-sm font-medium drop-shadow-sm">@{username}</div>
            </div>
        </div>
        <div className="flex gap-2">
            <button
                onClick={onAccept}
                className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#F7A8C1] to-[#C6B6F7] shadow hover:from-[#C6B6F7] hover:to-[#F7A8C1] transition"
            >
                Accept
            </button>
            <button
                onClick={onDecline}
                className="px-6 py-2 rounded-full font-semibold text-[#F7A8C1] bg-white border-2 border-[#F7A8C1]/40 hover:bg-accent-pink/10 transition"
            >
                Decline
            </button>
        </div>
    </div>
);

export default FriendRequestCard;
