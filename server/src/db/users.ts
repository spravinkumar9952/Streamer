import mongoose from "mongoose";
import { Schema, model, Document } from "mongoose";
import { removeUserFromRooms } from "./streamingRoom";
import { UserNotFoundError, UserNotFriendError } from "./errors/users";

export interface User extends Document {
    email: string;
    userName: string;
    picture: string | undefined;
    friendRequestsSent: string[];
    friendRequestsReceived: string[];
    friends: string[];
    joinedStreamingRooms: string[];
    location: string | undefined;
    bio: string | undefined;
}

const UserSchema = new Schema<User>({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String, required: false },
    friendRequestsSent: { type: [String], default: [] },
    friendRequestsReceived: { type: [String], default: [] },
    friends: { type: [String], default: [] },
    joinedStreamingRooms: { type: [String], default: [] },
    location: { type: String, required: false },
    bio: { type: String, required: false },
});

export const UserModel = model<User>("User", UserSchema);

export const getUserDetails = async (email: string): Promise<User> => {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        throw new UserNotFoundError(email);
    }
    return user;
};

export const insertUser = async (email: string, userName: string, picture: string | undefined): Promise<void> => {
    const newUser = new UserModel({
        userName: userName,
        email: email,
        picture: picture,
    });
    await UserModel.insertMany(newUser);
};

export const updateUser = async (
    email: string,
    userName: string | undefined,
    picture: string | undefined,
    location: string | undefined,
    bio: string | undefined
) => {
    const userDetails = await UserModel.findOne({ email: email });
    if (!userDetails) {
        throw new UserNotFoundError(email);
    }

    if (userName) userDetails!.userName = userName;
    if (picture) userDetails!.picture = picture;
    if (location) userDetails!.location = location;
    if (bio) userDetails!.bio = bio;

    await UserModel.updateOne({ email: email }, userDetails!);
};

export const addFriendRequest = async (from: string, to: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!(await UserModel.findOne({ email: to }))) {
            throw new UserNotFoundError(to);
        }

        await UserModel.updateOne({ email: from }, { $addToSet: { friendRequestsSent: to } });
        await UserModel.updateOne({ email: to }, { $addToSet: { friendRequestsReceived: from } });

        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    }
};

export const acceptFriendRequest = async (personWhoAccepting: string, personWhoSent: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const isFriendRequestThere = await UserModel.findOne({
            email: personWhoAccepting,
            friendRequestsReceived: personWhoSent,
        });

        if (!isFriendRequestThere) {
            throw new UserNotFriendError(personWhoSent);
        }

        await UserModel.updateOne(
            { email: personWhoAccepting },
            { $pull: { friendRequestsReceived: personWhoSent }, $addToSet: { friends: personWhoSent } }
        );

        await UserModel.updateOne(
            { email: personWhoSent },
            { $pull: { friendRequestsSent: personWhoAccepting }, $addToSet: { friends: personWhoAccepting } }
        );

        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    }
};

export const getFriends = async (email: string) => {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        throw new UserNotFoundError(email);
    }
    return user.friends;
};

export const getStreamingRooms = async (userEmail: string) => {
    const userInfo = await UserModel.findOne({ email: userEmail });
    if (!userInfo) {
        throw new UserNotFoundError(userEmail);
    }

    return userInfo.joinedStreamingRooms;
};

export const matchUsersWithRegex = async (regex: string): Promise<User[]> => {
    try {
        console.log("Searching for regex:", regex);

        // If regex is empty, return empty array
        if (!regex || regex.trim() === "") {
            return [];
        }

        // Create a case-insensitive regex pattern
        const searchPattern = new RegExp(regex, "i");
        console.log("Search pattern:", searchPattern);

        const resp = await UserModel.find({
            $or: [{ email: searchPattern }, { userName: searchPattern }],
        });

        console.log("Found users:", resp);

        // If no results, try a simpler search
        if (resp.length === 0) {
            console.log("No results found, trying simpler search");
            const simpleResp = await UserModel.find({
                $or: [{ email: { $regex: regex, $options: "i" } }, { userName: { $regex: regex, $options: "i" } }],
            });

            console.log("Simple search results:", simpleResp);
            return simpleResp;
        }

        return resp;
    } catch (error) {
        console.error("Error in matchUsersWithRegex:", error);
        throw new Error("Failed to search users");
    }
};

export const updateJoinedStreamingRooms = async (email: string, roomId: string) => {
    await UserModel.findOneAndUpdate({ email }, { $addToSet: { joinedStreamingRooms: roomId } });
};

export const exitRoom = async (roomId: string, email: string) => {
    await UserModel.findOneAndUpdate({ email }, { $pull: { joinedStreamingRooms: roomId } });
};

export const unfriend = async (userEmail: string, friendEmail: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Remove each other from friends list
        await UserModel.updateOne({ email: userEmail }, { $pull: { friends: friendEmail } });
        await UserModel.updateOne({ email: friendEmail }, { $pull: { friends: userEmail } });

        // Get both users' joinedStreamingRooms
        const user = await UserModel.findOne({ email: userEmail });
        const friend = await UserModel.findOne({ email: friendEmail });
        if (!user || !friend) throw new Error("User not found");

        // Find intersection of rooms
        const userRooms = user.joinedStreamingRooms || [];
        const friendRooms = friend.joinedStreamingRooms || [];
        const sharedRooms = userRooms.filter((roomId) => friendRooms.includes(roomId));

        // Remove each user from the other's joinedStreamingRooms
        await UserModel.updateOne({ email: userEmail }, { $pull: { joinedStreamingRooms: { $in: sharedRooms } } });
        await UserModel.updateOne({ email: friendEmail }, { $pull: { joinedStreamingRooms: { $in: sharedRooms } } });

        // Remove each user from the other's joinedStreamingRooms
        await removeUserFromRooms(userEmail, friendEmail);

        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        console.error("[DB][users.ts][unfriend] Error in unfriend:", err);
        throw err;
    }
};

export const removeFriendRequest = async (from: string, to: string) => {
    const session = await mongoose.startSession();
    console.log("[DB][users.ts][removeFriendRequest] Removing friend request", from, to);
    session.startTransaction();
    try {
        await UserModel.updateOne({ email: from }, { $pull: { friendRequestsSent: to } });
        await UserModel.updateOne({ email: to }, { $pull: { friendRequestsReceived: from } });
        await session.commitTransaction();
        console.log("[DB][users.ts][removeFriendRequest] Friend request removed", from, to);
    } catch (err) {
        await session.abortTransaction();
        console.error("[DB][users.ts][removeFriendRequest] Error in removeFriendRequest:", err);
        throw err;
    }
};
