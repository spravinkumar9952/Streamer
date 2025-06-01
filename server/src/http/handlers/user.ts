import {
    acceptFriendRequest,
    addFriendRequest,
    getFriends,
    getUserDetails,
    matchUsersWithRegex,
    removeFriendRequest,
    unfriend,
    updateUser,
} from "../../db/users";
import { Request, Response } from "express";
import { ErrorResp, SuccessResp, User } from "../common";
import { getErrorMessage, getStatusCode } from "../error";
import { getFriendshipStatus } from "../utils/user";
import {
    DeleteFriendRequestReq,
    ProfileReq,
    UserProfileUpdateReq,
    FriendshipStatus,
    UserProfileParams,
    UserSearchParam,
    UserSearchResp,
    ProfileResp,
    UserProfileResp,
    FriendListReq,
    FriendListResp,
    UnfriendReq,
    FriendRequestAcceptReq,
    FriendRequestAcceptResp,
    UserProfileUpdateResp,
    DeleteFriendRequestResp,
    UnfriendResp,
    FriendRequestSentReq,
    FriendRequestSentResp,
} from "../types/user";

// ------------ Get User Profile API Start ----------------

export const profileHandler = async (req: Request<{}, {}, ProfileReq>, resp: Response<ProfileResp | ErrorResp>) => {
    try {
        const user = req.user as { email: string };
        const userDBResp = await getUserDetails(user.email);

        resp.status(200).json({
            email: userDBResp.email,
            name: userDBResp.userName,
            picture: userDBResp.picture,
            friendshipStatus: FriendshipStatus.YOU,
            location: userDBResp.location,
            bio: userDBResp.bio,
        });
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};

// ------------ Get User Profile API End ----------------

// ------------ Get User Profile Search API Start ----------------

export const handleUserSearch = async (
    req: Request<{}, {}, {}, Partial<UserSearchParam>>,
    resp: Response<UserSearchResp | ErrorResp>
) => {
    try {
        const searchKey = req.query.searchKey;
        const regex = "^" + searchKey;
        const matchedUsers = await matchUsersWithRegex(regex);
        const user = req.user as User;

        const result: UserSearchResp = {
            list: matchedUsers.map((item) => {
                const friendshipStatus = getFriendshipStatus(user, item);
                return {
                    email: item.email,
                    name: item.userName,
                    friendshipStatus: friendshipStatus,
                    picture: item.picture,
                    location: item.location,
                    bio: item.bio,
                };
            }),
        };
        resp.status(200).json(result);
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};

// ------------ Get User Profile Search API End ----------------

// ------------ Get other user profile ----------------

export const handleUserProfile = async (
    req: Request<{}, {}, {}, Partial<UserProfileParams>>,
    resp: Response<UserProfileResp | ErrorResp>
) => {
    const searchKey = req.query.email as string;
    try {
        const reqUser = await getUserDetails(searchKey);
        const user = req.user as User;
        const friendshipStatus = getFriendshipStatus(user, reqUser);
        resp.send({
            email: reqUser.email,
            name: reqUser.userName,
            friendshipStatus: friendshipStatus,
            picture: reqUser.picture,
            location: reqUser.location,
            bio: reqUser.bio,
        });
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};

// ------------ Post Friend Request Sent API Start --------------
export const handleFriendRequestSent = async (
    req: Request<{}, {}, FriendRequestSentReq>,
    resp: Response<FriendRequestSentResp | ErrorResp>
) => {
    const to = req.body.email;
    const user = req.user as { email: string };
    const from = user.email;
    try {
        await addFriendRequest(from, to);
        resp.status(200).json({ message: "OK" });
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};
// ------------ Post Friend Request Sent API End --------------

// ------------ Post friend request accept API Start ----------------

export const handleFriendRequestAccept = async (
    req: Request<{}, {}, FriendRequestAcceptReq>,
    resp: Response<FriendRequestAcceptResp | ErrorResp>
) => {
    const to = req.body.email;
    const user = req.user as { email: string };
    const from = user.email;

    try {
        await acceptFriendRequest(from, to);
        resp.status(200).json({ message: "OK" });
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};
// ------------ Post friend request accept API End ----------------

// ------------ Get friend list API Start ----------------

export const handleFriendList = async (
    req: Request<{}, {}, FriendListReq>,
    resp: Response<FriendListResp | ErrorResp>
) => {
    const user = req.user as User;

    try {
        const friendsEmail = await getFriends(user.email);
        const friendsList = [];
        const friendRequestsList = [];

        for (let email of friendsEmail) {
            const user = await getUserDetails(email);
            friendsList.push({
                email: email,
                name: user?.userName,
            });
        }

        const userDetails = await getUserDetails(user?.email);

        if (userDetails?.friendRequestsReceived) {
            for (let email of userDetails?.friendRequestsReceived) {
                const user = await getUserDetails(email);
                friendRequestsList.push({
                    email: email,
                    name: user?.userName,
                });
            }
        }

        const friendListResp = {
            friends: friendsList,
            friendRequests: friendRequestsList,
        };

        resp.status(200).json(friendListResp);
    } catch (err) {
        throw err;
    }
};

// ------------ Get friend list API End ----------------

// ------------ Unfriend API Start --------------

export const handleUnfriend = async (req: Request<{}, {}, UnfriendReq>, resp: Response<UnfriendResp | ErrorResp>) => {
    const friendEmail = req.body.email;
    const user = req.user as { email: string };
    try {
        await unfriend(user.email, friendEmail);
        resp.status(200).json({ message: "OK" });
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};
// ------------ Unfriend API End --------------

// ------------ Delete friend request API Start --------------

export const handleDeleteFriendRequest = async (
    req: Request<{}, {}, DeleteFriendRequestReq>,
    resp: Response<DeleteFriendRequestResp | ErrorResp>
) => {
    const friendEmail = req.body.email;
    const user = req.user as { email: string };
    const userEmail = user.email;
    try {
        await removeFriendRequest(friendEmail, userEmail);
        resp.status(200).json({ message: "OK" });
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};
// ------------ Delete friend request API End --------------

// ------------ Update user profile API Start --------------

export const handleUserProfileUpdate = async (
    req: Request<{}, {}, UserProfileUpdateReq>,
    resp: Response<UserProfileUpdateResp | ErrorResp>
) => {
    const user = req.user as User;
    const userEmail = user.email;
    const name = req.body.name;
    const picture = req.body.picture;
    const location = req.body.location;
    const bio = req.body.bio;

    try {
        await updateUser(userEmail, name, picture, location, bio);
        resp.status(200).json({ message: "OK" });
    } catch (err) {
        resp.status(getStatusCode(err)).json(getErrorMessage(err));
    }
};

// ------------ Update user profile API End --------------
