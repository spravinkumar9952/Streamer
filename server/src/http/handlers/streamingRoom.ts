import express, { NextFunction, Request, Response } from "express";
import { addUserToRoom, getStreamingRooms, getUserDetails, removeUserFromRoom } from "../../db/users";
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
import { getStatusCode, getErrorMessage } from "../error";
import mongoose from "mongoose";

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
    try {
        const resp = await createRoom(user.email, body.friends, body.roomName, body.videoUrl);
        res.send({ id: resp });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(getStatusCode(error)).send(getErrorMessage(error));
    }
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

    try {
        await getRoomById(roomId);
        await deleteRoom(roomId, user.email, res);
        res.send({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(getStatusCode(error)).send(getErrorMessage(error));
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
        res.status(getStatusCode(err)).send(getErrorMessage(err));
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
        res.status(getStatusCode(err)).send(getErrorMessage(err));
    }
};

interface AddFriendsToRoomReq {
    roomId: string;
    friends: string[];
}

export const addFriendsToRoom = async (
    req: Request<{}, {}, AddFriendsToRoomReq>,
    res: Response<SuccessResp | ErrorResp>
) => {
    const user = req.user as User;
    const body = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("addFriendsToRoom body", body);
    try {
        await addFriendsToRoomDB(body.roomId, user.email, body.friends, session);
        for (const friendEmail of body.friends) {
            await addUserToRoom(friendEmail, body.roomId, session);
        }
        await session.commitTransaction();
        console.log("addFriendsToRoom success");
        res.send({ message: "Friends added to room successfully" });
    } catch (err) {
        console.error("addFriendsToRoom Error", err);
        await session.abortTransaction();
        res.status(getStatusCode(err)).send(getErrorMessage(err));
    } finally {
        session.endSession();
    }
};

interface RemoveFriendsFromRoomReq {
    roomId: string;
    friends: string[];
}

export const removeFriendsFromRoom = async (
    req: Request<{}, {}, RemoveFriendsFromRoomReq>,
    res: Response<SuccessResp | ErrorResp>
) => {
    const user = req.user as User;
    const body = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userDB = await getUserDetails(user.email);
        const friends = body.friends;
        const filterValidFriends = friends.filter((friend: string) => userDB.friends.includes(friend));
        await removeFriendsFromRoomDB(body.roomId, user.email, filterValidFriends);
        for (const friendEmail of filterValidFriends) {
            await removeUserFromRoom(friendEmail, body.roomId, session);
        }
        await session.commitTransaction();
        res.send({ message: "Friends removed from room successfully" });
    } catch (error) {
        console.error("removeFriendsFromRoom Error", error);
        await session.abortTransaction();
        res.status(getStatusCode(error)).send(getErrorMessage(error));
    } finally {
        session.endSession();
    }
};
