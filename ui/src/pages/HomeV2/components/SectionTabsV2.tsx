import React from "react";
import VideoIcon from "../svg/VideoIcon";
import FriendsIcon from "../svg/FriendsIcon";

export enum SectionV2 {
    Rooms = "Rooms",
    Friends = "Friends",
}

type Props = {
    selected: SectionV2;
    onSelect: (section: SectionV2) => void;
};

export const SectionTabsV2: React.FC<Props> = ({ selected, onSelect }) => {
    return (
        <div className="flex gap-4 bg-background-tertiary rounded-full p-2 w-fit mx-auto shadow-sm">
            <button
                onClick={() => onSelect(SectionV2.Rooms)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium text-lg transition-all duration-200 focus:outline-none
                    ${
                        selected === SectionV2.Rooms
                            ? "bg-accent-pink/20 text-[#4A4458] shadow"
                            : "text-text-tertiary hover:bg-accent-pink/10"
                    }`}
            >
                <VideoIcon className="w-6 h-6" />
                Rooms
            </button>
            <button
                onClick={() => onSelect(SectionV2.Friends)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium text-lg transition-all duration-200 focus:outline-none
                    ${
                        selected === SectionV2.Friends
                            ? "bg-accent-pink/20 text-[#4A4458] shadow"
                            : "text-text-tertiary hover:bg-accent-pink/10"
                    }`}
            >
                <FriendsIcon className="w-6 h-6" />
                Friends
            </button>
        </div>
    );
};
