import mongoose, { model, Schema } from "mongoose";
import { exitRoom, updateJoinedStreamingRooms, UserModel } from "./users";
import { UUID } from "mongodb";
import { v4 as uuidV4 } from "uuid";
import { ErrorResp } from "../http/common";
import { SuccessResp } from "../http/common";
import { Response } from "express";
import { NotOwnerError } from "./errors/streamingRoom";
import { RoomNotFoundError } from "./errors/streamingRoom";

interface StreamingRoom extends Document {
    _id: string;
    created_at: Date;
    joinedUsers: string[];
    name: string;
    videoUrl: string;
    createdBy: string;
}

export const StreamingRoomSchema = new Schema<StreamingRoom>({
    _id: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    joinedUsers: { type: [String], default: [] },
    name: { type: String, required: true },
    videoUrl: { type: String },
    createdBy: { type: String, required: true },
});

export const StreamingRoomModel = model<StreamingRoom>("StreamingRoom", StreamingRoomSchema);

export const createRoom = async (createdBy: string, joinedUsers: string[], roomName: string, videoUrl: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const id = uuidV4();

    try {
        const newRoom = new StreamingRoomModel({
            _id: id,
            joinedUsers: joinedUsers,
            name: roomName,
            createdBy: createdBy,
            videoUrl: videoUrl,
        });
        await newRoom.save();
        joinedUsers.forEach(async (joinedUser) => await updateJoinedStreamingRooms(joinedUser, id));
        console.log("createRoom, createdBy", createdBy);
        await updateJoinedStreamingRooms(createdBy, id);
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    }

    return id;
};

export const addPerson = async (roomId: string, usersEmail: [string]) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await StreamingRoomModel.findByIdAndUpdate({ _id: roomId }, { $addToSet: { joinedUsers: usersEmail } });
        usersEmail.forEach(
            async (userEmail) =>
                await UserModel.findByIdAndUpdate({ email: userEmail }, { $addToSet: { joinedStreamingRooms: roomId } })
        );
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    }
};

export const updateVideoURL = async (roomId: string, videoUrl: string) => {
    await StreamingRoomModel.findByIdAndUpdate({ _id: roomId }, { videoUrl: videoUrl });
};

export const deleteRoom = async (
    roomId: string,
    deleteBy: string,
    res: Response<SuccessResp | ErrorResp>
): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("deleteRoom", roomId, deleteBy);
        const room = await StreamingRoomModel.findById(roomId).session(session);
        if (!room) {
            res.status(404).send({ message: "Room not found" });
            return;
        }

        if (room.createdBy !== deleteBy) {
            res.status(403).send({ message: "You are not authorized to delete this room" });
            return;
        }

        await Promise.all(room.joinedUsers.map(async (joinedUser: string) => await exitRoom(roomId, joinedUser)));

        await exitRoom(roomId, room.createdBy);

        await StreamingRoomModel.deleteOne({ _id: roomId }).session(session);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getRoomById = async (roomId: string): Promise<StreamingRoom> => {
    const resp = await StreamingRoomModel.findOne({ _id: roomId });
    if (!resp) {
        throw new RoomNotFoundError(roomId);
    }

    return resp;
};

export const updateUserSocketId = async (roomId: string, email: string, socketId: string) => {
    await StreamingRoomModel.findOneAndUpdate(
        { _id: roomId, "joinedUsers.email": email },
        { $set: { "joinedUsers.$.socketId": socketId } }
    );
};

// ------------------- API update video url Start ----------

export const updateVideoUrlById = async (roomId: string, videoUrl: string) => {
    await StreamingRoomModel.findByIdAndUpdate({ _id: roomId }, { videoUrl: videoUrl });
};
// ------------------- API update video url End ----------

export const removeUserFromRooms = async (userEmail: string, friendEmail: string) => {
    await StreamingRoomModel.updateMany(
        { joinedUsers: { $in: [userEmail, friendEmail] } },
        { $pull: { joinedUsers: { $in: [userEmail, friendEmail] } } }
    );
};

export const updateRoom = async (
    roomId: string,
    userEmail: string,
    videoUrl: string | undefined,
    name: string | undefined
) => {
    const room = await StreamingRoomModel.findById(roomId);
    if (!room) {
        throw new RoomNotFoundError(roomId);
    } else if (room.createdBy !== userEmail) {
        throw new NotOwnerError(roomId);
    }

    if (videoUrl) room.videoUrl = videoUrl;
    if (name) room.name = name;

    await StreamingRoomModel.updateOne({ _id: roomId }, room);
};

export const addFriendsToRoom = async (roomId: string, userEmail: string, friends: string[]) => {
    const room = await StreamingRoomModel.findById(roomId);
    if (!room) {
        throw new RoomNotFoundError(roomId);
    } else if (room.createdBy !== userEmail) {
        throw new NotOwnerError(roomId);
    }

    await StreamingRoomModel.findByIdAndUpdate({ _id: roomId }, { $addToSet: { joinedUsers: { $in: friends } } });
};

export const removeFriendsFromRoom = async (roomId: string, userEmail: string, friends: string[]) => {
    const room = await StreamingRoomModel.findById(roomId);
    if (!room) {
        throw new RoomNotFoundError(roomId);
    } else if (room.createdBy !== userEmail) {
        throw new NotOwnerError(roomId);
    }

    await StreamingRoomModel.findByIdAndUpdate({ _id: roomId }, { $pull: { joinedUsers: { $in: friends } } });
};
