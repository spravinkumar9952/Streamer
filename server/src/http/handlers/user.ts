import { acceptFriendRequest, addFriendRequest, getFriends, getUserDetails, matchUsersWithRegex } from "../../db/users";
import { Request, Response } from "express";
import { ErrorResp, SuccessResp, User } from "../common";

// ------------ Get User Profile API Start ----------------
interface ProfileReq {}
interface ProfileResp {
    email: string;
    name: string;
}

export const profileHandler = async (req: Request<{}, {}, ProfileReq>, resp: Response<ProfileResp | ErrorResp>) => {
    const user = req.user as { email: string };
    const userDBResp = await getUserDetails(user.email);
    console.log("UserResp", userDBResp, user.email);

    if (userDBResp) {
        resp.json({
            email: userDBResp.email,
            name: userDBResp.userName,
        });
    } else {
        resp.status(404).json({ message: "User not found" });
    }
};

// ------------ Get User Profile API End ----------------

// ------------ Get User Profile Search API Start ----------------

interface UserSearchParam {
    searchKey: string;
}

interface UserSearchResp {
    list: ProfileResp[];
}

export const handleUserSearch = async (
    req: Request<{}, {}, {}, Partial<UserSearchParam>>,
    resp: Response<UserSearchResp | ErrorResp>
) => {
    const searchKey = req.query.searchKey;
    const regex = "^" + searchKey;
    console.log("regex", regex);
    const matchedUsers = await matchUsersWithRegex(regex);
    console.log("matchedUsers", matchedUsers);

    const result: UserSearchResp = {
        list: matchedUsers.map((item) => {
            return { email: item.email, name: item.userName };
        }),
    };
    resp.send(result);
};

// ------------ Get User Profile Search API End ----------------

// ------------ Get other user profile ----------------
interface UserProfileParams {
    email: string;
}
interface UserProfileResp extends ProfileResp {}

export const handleUserProfile = async (
    req: Request<{}, {}, {}, Partial<UserProfileParams>>,
    resp: Response<UserProfileResp | ErrorResp>
) => {
    const searchKey = req.query.email as string;
    console.log("handleUserProfile", "searchKey", req.query);
    const user = await getUserDetails(searchKey);
    if (user === null) {
        resp.send({ message: "User not found for email id " + searchKey });
        return;
    }
    resp.send({ email: user.email, name: user.userName });
};

// ------------ Post Friend Request Sent API Start --------------
export const handleFriendRequestSent = async (req: Request, resp: Response) => {
    console.log("Inside_handleFriendRequestSent");
    const to = req.body.email;
    const user = req.user as { email: string };
    const from = user.email;
    try {
        await addFriendRequest(from, to);
        resp.status(200).send("OK");
    } catch (err) {
        resp.status(500).send(err);
    }
};
// ------------ Post Friend Request Sent API End --------------

// ------------ Post friend request accept API Start ----------------
interface FriendRequestAcceptReq {
    email: string;
}

export const handleFriendRequestAccept = async (
    req: Request<{}, {}, FriendRequestAcceptReq>,
    resp: Response<SuccessResp | ErrorResp>
) => {
    const to = req.body.email;
    const user = req.user as { email: string };
    const from = user.email;

    try {
        await acceptFriendRequest(from, to);
        resp.status(200).json({ message: "OK" });
    } catch (err) {
        resp.status(500).json({ message: "ACCEPT_FRIEND_REQUEST_FAILED" });
    }
};
// ------------ Post friend request accept API End ----------------

// ------------ Get friend list API Start ----------------
interface FriendListResp {
    friends: {
        email: string;
        name: string | undefined;
    }[];
    friendRequests: {
        email: string;
        name: string | undefined;
    }[];
}

interface FriendListReq {}

export const handleFriendList = async (req: Request<{}, {}, FriendListReq>, resp: Response<FriendListResp>) => {
    const user = req.user as User;

    try {
        const friendsEmail = await getFriends(user.email);
        const friendsList = [];
        const friendRequestsList = [];

        for (let email of friendsEmail) {
            const user = await getUserDetails(email);
            console.log("user", user);
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
