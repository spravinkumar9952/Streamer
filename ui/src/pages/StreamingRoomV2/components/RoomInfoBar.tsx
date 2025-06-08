import React from "react";
import { FiUsers, FiClock, FiVideo } from "react-icons/fi";

interface RoomInfoBarProps {
    roomName: string;
    activeTime: string;
    isCreator: boolean;
    onUpdateUrl: () => void;
}

const RoomInfoBar: React.FC<RoomInfoBarProps> = ({ roomName, activeTime, isCreator, onUpdateUrl }) => {
    return (
        <div className="bg-white/80 border-t border-pink-100 p-4 rounded-b-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <FiClock className="text-pink-400" size={20} />
                        <span className="text-sm text-gray-600">{activeTime} elapsed</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">{roomName}</div>
                    {isCreator && (
                        <button
                            onClick={onUpdateUrl}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            Update Video
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomInfoBar;
