import React, { memo } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

interface RoomHeaderProps {
    room: {
        name: string;
        createdBy: string;
    };
    onLeave: () => void;
    onDelete?: () => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = memo(({ room, onLeave, onDelete }) => {
    return (
        <header className="flex items-center justify-between px-8 py-4 border-b border-pink-100 bg-white/80 rounded-t-2xl">
            <div className="flex items-center gap-4">
                <button className="text-pink-400 hover:text-pink-600" title="Back">
                    <FiArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-[#4A4458] tracking-tight">{room.name}</h2>
                    <p className="text-xs text-pink-400 font-medium">Created by {room.createdBy}</p>
                </div>
            </div>
            <div className="flex gap-2">
                {onDelete && (
                    <button
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-red-600 bg-white hover:bg-red-50 font-semibold transition"
                        onClick={onDelete}
                    >
                        🗑 Delete Room
                    </button>
                )}
                <button
                    className="flex items-center gap-2 px-4 py-2 border border-pink-200 rounded-lg text-pink-600 bg-white hover:bg-pink-50 font-semibold transition"
                    onClick={onLeave}
                >
                    <MdLogout size={20} /> Leave Room
                </button>
            </div>
        </header>
    );
});

export default RoomHeader;
