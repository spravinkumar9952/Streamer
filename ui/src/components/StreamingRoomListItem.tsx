import { FC } from "react";
import { StreamingRoom } from "../api/streamingRoom";
import React from "react";
import { useNavigate, useNavigation } from "react-router-dom";

interface StreamingRoomListItemPropsType {
    item: StreamingRoom;
}

export const StreamingRoomListItem: FC<StreamingRoomListItemPropsType> = ({ item }) => {
    const navigation = useNavigate();

    const onRoomClick = () => {
        navigation(`/streamingRoom/${item.id}`, { state: { streamingRoomObj: item } });
    };

    return (
        <div className="m-2 w-2/3 p-2 bg-secondaryBG rounded-md flex flex-row items-center " onClick={onRoomClick}>
            <img src="/png/ic_room_door.png" width={20} height={20} alt="room image" />
            <text className="mx-4">{item.name}</text>
        </div>
    );
};
