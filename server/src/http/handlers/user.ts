import { acceptFriendRequest, addFriendRequest, getFriends, getUserDetails, matchUsersWithRegex } from "../../db/users";
import { Request, Response } from "express";
import { ErrorResp, SuccessResp, User } from "../common";
import { User as UserDB } from "../../db/users";

// ------------ Get User Profile API Start ----------------
interface ProfileReq {}

interface ProfileResp {
    email: string;
    name: string;
    picture: string | undefined;
    friendshipStatus: FriendshipStatus;
}
enum FriendshipStatus {
    FRIEND = "FRIEND",
    REQUEST_SENT = "REQUEST_SENT",
    REQUEST_RECEIVED = "REQUEST_RECEIVED",
    NOT_FRIEND = "NOT_FRIEND",
    YOU = "YOU",
}

export const profileHandler = async (req: Request<{}, {}, ProfileReq>, resp: Response<ProfileResp | ErrorResp>) => {
    const user = req.user as { email: string };
    const userDBResp = await getUserDetails(user.email);

    if (userDBResp) {
        resp.json({
            email: userDBResp.email,
            name: userDBResp.userName,
            picture: userDBResp.picture,
            friendshipStatus: FriendshipStatus.YOU,
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
            };
        }),
    };
    console.log("result", result);
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
    const reqUser = await getUserDetails(searchKey);
    if (reqUser === null) {
        resp.send({ message: "User not found for email id " + searchKey });
        return;
    }

    const user = req.user as User;
    const friendshipStatus = getFriendshipStatus(user, reqUser);
    resp.send({
        email: reqUser.email,
        name: reqUser.userName,
        friendshipStatus: friendshipStatus,
        picture: reqUser.picture,
    });
};

const getFriendshipStatus = (whom: User, who: UserDB) => {
    const isFriend = who.friends.includes(whom.email);
    const isFriendRequestSent = who.friendRequestsReceived.includes(whom.email);
    const isFriendRequestReceived = who.friendRequestsSent.includes(whom.email);
    const isYou = whom.email === who.email;

    return isFriend
        ? FriendshipStatus.FRIEND
        : isFriendRequestSent
        ? FriendshipStatus.REQUEST_SENT
        : isFriendRequestReceived
        ? FriendshipStatus.REQUEST_RECEIVED
        : isYou
        ? FriendshipStatus.YOU
        : FriendshipStatus.NOT_FRIEND;
};

// ------------ Post Friend Request Sent API Start --------------
export const handleFriendRequestSent = async (req: Request, resp: Response) => {
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
