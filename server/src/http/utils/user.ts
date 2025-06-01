import { User as UserDB } from "../../db/users";
import { User } from "../common";
import { FriendshipStatus } from "../types/user";

export const getFriendshipStatus = (whom: User, who: UserDB) => {
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
