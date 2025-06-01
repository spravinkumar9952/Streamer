import React, { useEffect } from "react";
import { ProfileResp } from "../../../api/profile";
import ClockIcon from "../svg/ClockIcon";
import VideoIcon from "../svg/VideoIcon";
import HeartIcon from "../svg/HeartIcon";
import FriendsIcon from "../svg/FriendsIcon";

interface ProfileStatsProps {
    user: ProfileResp | null;
}

const stats = [
    {
        label: "Total Watch Time",
        key: "watchTime",
        icon: <ClockIcon className="w-8 h-8 text-[#F7A8C1] mx-auto mb-2" />,
    },
    {
        label: "Rooms Created",
        key: "roomsCreated",
        icon: <VideoIcon className="w-8 h-8 text-[#C6B6F7] mx-auto mb-2" />,
    },
    {
        label: "Movies Watched",
        key: "moviesWatched",
        icon: <HeartIcon className="w-8 h-8 text-[#A084CA] mx-auto mb-2" />,
    },
    { label: "Friends", key: "friends", icon: <FriendsIcon className="w-8 h-8 text-[#FFD3B6] mx-auto mb-2" /> },
];

// Placeholder values for demo; replace with real user stats if available
const getStatValue = (user: ProfileResp | null, key: string) => {
    switch (key) {
        case "watchTime":
            return "No data";
        case "roomsCreated":
            return "No data";
        case "moviesWatched":
            return "No data";
        case "friends":
            return "No data";
        default:
            return "-";
    }
};

const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16">
        {stats.map((stat) => (
            <div
                key={stat.key}
                className="bg-white/80 rounded-2xl shadow flex flex-col items-center justify-center py-8 px-4 border border-[#F7A8C1]/10"
            >
                {stat.icon}
                <div className="text-2xl font-bold text-[#4A4458] mb-1">{getStatValue(user, stat.key)}</div>
                <div className="text-[#A084CA] text-sm font-medium">{stat.label}</div>
            </div>
        ))}
    </div>
);

export default ProfileStats;
