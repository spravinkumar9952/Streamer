import { FC } from "react";
import { StreamingRoom } from "../api/streamingRoom";
import React from "react";
import { useNavigate } from "react-router-dom";

interface StreamingRoomListItemPropsType {
    item: StreamingRoom;
}

export const StreamingRoomListItem: FC<StreamingRoomListItemPropsType> = ({ item }) => {
    const navigation = useNavigate();

    const onRoomClick = () => {
        navigation(`/streamingRoom/${item.id}`, { state: { streamingRoomObj: item } });
    };

    return (
        <button
            className="w-2/3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 mx-2 mb-4 cursor-pointer text-left"
            onClick={onRoomClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src="/png/ic_room_door.png"
                            alt="room"
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 p-2"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800 text-lg">{item.name}</h2>
                        <p className="text-sm text-gray-500">
                            {item.joinedUsers.length} {item.joinedUsers.length === 1 ? 'member' : 'members'} • Created {new Date(item.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Join Room</span>
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </button>
    );
};
