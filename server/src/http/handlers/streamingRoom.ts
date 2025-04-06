import express, { NextFunction, Request, Response } from "express";
import { getStreamingRooms } from "../../db/users";
import { createRoom, deleteRoom, getRoomById, updateVideoUrlById } from "../../db/streamingRoom";
import { ErrorResp, SuccessResp, User } from "../common";

// ------------------- API create streaming room list Start ----------
interface StreamingRoomReq {
    roomName: string;
    friends: string[];
    videoUrl: string;
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
    const resp = await createRoom(user.email, body.friends, body.roomName, body.videoUrl);
    res.send({ id: resp });
};

// ------------------- API delete streaming room list Start ----------

interface DeleteStreamingRoomReq {
    roomId: string;
}

export const deleteStreamingRoom = async (
    req: Request<{}, {}, {}, { roomId: string }>,
    res: Response<SuccessResp | ErrorResp>
) => {
    const user = req.user as User;
    const roomId = req.query.roomId;

    if (!roomId) {
        res.status(400).send({ message: "Room ID is required" });
        return;
    }

    try {
        const room = await getRoomById(roomId);
        await deleteRoom(roomId, user.email, res);
        res.send({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).send({ message: "Failed to delete room" });
    }
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

// ------------------- API update video url Start ----------

interface UpdateVideoUrlReq {
    roomId: string;
    videoUrl: string;
}

export const updateVideoUrl = async (
    req: Request<{}, {}, UpdateVideoUrlReq>,
    res: Response<SuccessResp | ErrorResp>
) => {
    const user = req.user as User;
    const body = req.body as { roomId: string; videoUrl: string };

    try {
        const streamingRoom = await getRoomById(body.roomId);
        if (streamingRoom == undefined) {
            res.status(404).send({ message: "Room info not found for id " + body.roomId });
            return;
        }
        if (streamingRoom.createdBy !== user.email) {
            res.status(403).send({ message: "You are not the owner of this room" });
            return;
        }

        await updateVideoUrlById(body.roomId, body.videoUrl);
        res.send({ message: "Video URL updated successfully" });
    } catch (err) {
        console.error("updateVideoUrl Error", err);
        res.status(500).send({ message: err as string });
    }
};
