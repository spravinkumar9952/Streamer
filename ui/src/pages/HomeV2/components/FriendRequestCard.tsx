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
    <div className="flex items-center justify-between bg-background-tertiary rounded-2xl p-4 shadow mb-2">
        <div className="flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: color }}
            >
                {initials}
            </div>
            <div>
                <div className="font-semibold text-[#22223B]">{name}</div>
                <div className="text-text-tertiary text-sm">@{username}</div>
            </div>
        </div>
        <div className="flex gap-2">
            <button
                onClick={onAccept}
                className="px-5 py-2 rounded-full font-medium text-white bg-gradient-to-r from-[#F7A8C1] to-[#F7E6A8] shadow hover:from-[#F7E6A8] hover:to-[#F7A8C1]"
            >
                Accept
            </button>
            <button
                onClick={onDecline}
                className="px-5 py-2 rounded-full font-medium border border-border-light text-text-primary bg-white hover:bg-background-tertiary"
            >
                Decline
            </button>
        </div>
    </div>
);

export default FriendRequestCard;
