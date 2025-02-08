import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface User extends Document {
    email: string;
    userName: string;
    friendRequestsSent: string[];
    friendRequestsReceived: string[];
    friends: string[];
    joinedStreamingRooms: string[];
}

const UserSchema = new Schema<User>({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    friendRequestsSent: { type: [String], default: [] },
    friendRequestsReceived: { type: [String], default: [] },
    friends: { type: [String], default: [] },
    joinedStreamingRooms: { type: [String], default: [] },
});

export const UserModel = model<User>("User", UserSchema);

export const getUserDetails = async (email: string): Promise<User | null> => {
    return await UserModel.findOne({ email: email });
};

export const insertUser = async (email: string, userName: string): Promise<void> => {
    const newUser = new UserModel({
        userName: userName,
        email: email,
    });
    await UserModel.insertMany(newUser);
};

export const updateUser = async (email: string, userName: string | undefined) => {
    const userDetails = new UserModel();

    if (userName) userDetails.userName = userName;

    UserModel.updateOne({ email: email }, userDetails);
};

export const addFriendRequest = async (from: string, to: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!(await UserModel.findOne({ email: to }))) {
            throw new Error(`User not exist with {to}`);
        }

        await UserModel.updateOne({ email: from }, { $addToSet: { friendRequestsSent: to } });
        await UserModel.updateOne({ email: to }, { $addToSet: { friendRequestsReceived: from } });

        session.commitTransaction();
        console.log("Completed friend request");
    } catch (err) {
        session.abortTransaction();
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
            throw new Error("No friend request found");
        }

        await UserModel.updateOne(
            { email: personWhoAccepting },
            { $pull: { friendRequestsReceived: personWhoSent }, $addToSet: { friends: personWhoSent } }
        );

        await UserModel.updateOne(
            { email: personWhoSent },
            { $pull: { friendRequestsSent: personWhoAccepting }, $addToSet: { friends: personWhoAccepting } }
        );

        session.commitTransaction();
    } catch (err) {
        session.abortTransaction();
        throw err;
    }
};

export const getFriends = async (email: string) => {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        throw new Error(`No user found with email {email}`);
    }
    return user.friends;
};

export const getStreamingRooms = async (userEmail: string) => {
    const userInfo = await UserModel.findOne({ email: userEmail });
    if (!userInfo) {
        throw new Error(`No user found with email {userEmail}`);
    }

    return userInfo.joinedStreamingRooms;
};

export const matchUsersWithRegex = async (regex: string): Promise<User[]> => {
    // const resp = await UserModel.find({
    //   email: {
    //       $regex: regex,
    //       $options: 'i'
    //   }
    // });

    const resp = await UserModel.find();

    return resp;
};

export const updateJoinedStreamingRooms = async (email: string, roomId: string) => {
    const resp = await UserModel.updateOne({ email: email }, { $addToSet: { joinedStreamingRooms: roomId } });
    if (resp.matchedCount < 0) {
        throw new Error(`No user found with email {userEmail}`);
    }
};

export const exitRoom = async (roomId: string, email: string) => {
    const resp = await UserModel.updateOne({ email: email }, { $pop: { joinedStreamingRooms: roomId } });

    if (resp.matchedCount < 0) {
        throw new Error(`No user found with email {userEmail}`);
    }
};
