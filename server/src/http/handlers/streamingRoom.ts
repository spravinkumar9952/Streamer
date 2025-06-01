import express, { NextFunction, Request, Response } from "express";
import { getStreamingRooms, getUserDetails } from "../../db/users";
import {
    createRoom,
    deleteRoom,
    getRoomById,
    updateRoom,
    addFriendsToRoom as addFriendsToRoomDB,
    removeFriendsFromRoom as removeFriendsFromRoomDB,
} from "../../db/streamingRoom";
import { ErrorResp, SuccessResp, User } from "../common";
import { UserNotFriendError } from "../../db/errors/users";
import { NotOwnerError, RoomNotFoundError } from "../../db/errors/streamingRoom";

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
    created_at: Date;
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
                    created_at: roomInfoFromDB.created_at,
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

interface UpdateStreamingRoomReq {
    roomId: string;
    videoUrl?: string;
    name?: string;
}

export const updateStreamingRoom = async (
    req: Request<{}, {}, UpdateStreamingRoomReq>,
    res: Response<SuccessResp | ErrorResp>
) => {
    const user = req.user as User;
    const body = req.body;
    try {
        await updateRoom(body.roomId, user.email, body.videoUrl, body.name);
        res.send({ message: "Room updated successfully" });
    } catch (err) {
        console.error("updateStreamingRoom Error", err);
        res.status(500).send({ message: err as string });
    }
};

interface AddFriendsToRoomReq {
    roomId: string;
    friends: string[];
}

export const addFriendsToRoom = async (req: Request, res: Response<SuccessResp | ErrorResp>) => {
    const user = req.user as User;
    const body = req.body;
    try {
        await addFriendsToRoomDB(body.roomId, user.email, body.friends);

        res.send({ message: "Friends added to room successfully" });
    } catch (err) {
        console.error("addFriendsToRoom Error", err);
        res.status(500).send({ message: err as string });
    }
};

interface RemoveFriendsFromRoomReq {
    roomId: string;
    friends: string[];
}

export const removeFriendsFromRoom = async (req: Request, res: Response<SuccessResp | ErrorResp>) => {
    const user = req.user as User;
    const body = req.body;
    try {
        const userDB = await getUserDetails(user.email);
        const friends = body.friends;
        const filterValidFriends = friends.filter((friend: string) => userDB.friends.includes(friend));
        await removeFriendsFromRoomDB(body.roomId, user.email, filterValidFriends);
        res.send({ message: "Friends removed from room successfully" });
    } catch (error) {
        if (error instanceof UserNotFriendError) {
            res.status(400).send({ message: error.message });
        } else if (error instanceof RoomNotFoundError) {
            res.status(404).send({ message: error.message });
        } else if (error instanceof NotOwnerError) {
        } else {
            console.error("removeFriendsFromRoom Error", error);
            res.status(500).send({ message: error as string });
        }
    }
};
