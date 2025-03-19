import express, { NextFunction, Request, Response } from "express";
import { getStreamingRooms } from "../../db/users";
import { createRoom, deleteRoom, getRoomById } from "../../db/streamingRoom";
import { ErrorResp, SuccessResp, User } from "../common";

// ------------------- API create streaming room list Start ----------
interface StreamingRoomReq {
    roomName: string;
    friends: string[];
}

interface StreamingRoomResp {
    id: string;
}

export const createStreamingRoom = async (
    req: Request<{}, {}, StreamingRoomReq>,
    res: Response<StreamingRoomResp | ErrorResp>
) => {
    const user = req.user as User;
    const body = req.body;
    const resp = await createRoom(user.email, body.friends, body.roomName);
    res.send({ id: resp });
};

// ------------------- API delete streaming room list Start ----------

interface DeleteStreamingRoomReq {
    roomId: string;
}

export const deleteStreamingRoom = async (
    req: Request<{}, {}, DeleteStreamingRoomReq>,
    res: Response<SuccessResp | ErrorResp>
) => {
    const user = req.user as User;
    const body = req.body as { roomId: string };

    const resp = await deleteRoom(user.email);
};

// ------------------- API get streaming room list Start ----------

interface StreamingRoom {
    id: string;
    created_at: string;
    joinedUsers: string[];
    name: string;
    videoUrl: string;
    createdBy: string;
}

interface StreamingRoomListResp {
    list: StreamingRoom[];
}

interface StreamingRoomReq {}

export const getStreamingRoomsHandler = async (
    req: Request<{}, {}, StreamingRoomReq>,
    res: Response<StreamingRoomListResp | ErrorResp>
) => {
    const user = req.user as User;

    try {
        const roomsId = await getStreamingRooms(user.email);
        const roomsList = await Promise.all(
            roomsId.map(async (roomId) => {
                console.log("getStreamingRoomsHandler RoomId", roomId);
                const roomInfoFromDB = await getRoomById(roomId);
                console.log("getStreamingRoomsHandler roomInfoFromDB", roomInfoFromDB);
                if (roomInfoFromDB == undefined) {
                    throw new Error("Room info not found for id " + roomId);
                }
                const roomInfo: StreamingRoom = {
                    id: roomInfoFromDB._id.toString(),
                    created_at: roomInfoFromDB.created_at.toLocaleString(),
                    joinedUsers: roomInfoFromDB.joinedUsers,
                    name: roomInfoFromDB.name,
                    videoUrl: roomInfoFromDB.videoUrl,
                    createdBy: roomInfoFromDB.createdBy,
                };
                return roomInfo;
            })
        );
        res.send({ list: roomsList });
    } catch (err) {
        console.error("getStreamingRoomsHandler Error", err);
        res.status(500).send({ message: err as string });
    }
};
