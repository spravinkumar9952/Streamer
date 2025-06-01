import { SuccessResp } from "../common";

export interface ProfileReq {}

export interface ProfileResp {
    email: string;
    name: string;
    picture: string | undefined;
    friendshipStatus: FriendshipStatus;
    location: string | undefined;
    bio: string | undefined;
}
export enum FriendshipStatus {
    YOU = "YOU",
    FRIEND = "FRIEND",
    REQUEST_SENT = "REQUEST_SENT",
    REQUEST_RECEIVED = "REQUEST_RECEIVED",
    NOT_FRIEND = "NOT_FRIEND",
}

export interface UserSearchParam {
    searchKey: string;
}

export interface UserSearchResp {
    list: ProfileResp[];
}

export interface UserProfileParams {
    email: string;
}
export interface UserProfileResp extends ProfileResp {}

export interface FriendRequestSentReq {
    email: string;
}
export interface FriendRequestSentResp extends SuccessResp {}

export interface FriendListResp {
    friends: {
        email: string;
        name: string | undefined;
    }[];
    friendRequests: {
        email: string;
        name: string | undefined;
    }[];
}

export interface FriendListReq {}

export interface UnfriendReq {
    email: string;
}

export interface UnfriendResp extends SuccessResp {}

export interface DeleteFriendRequestReq {
    email: string;
}

export interface DeleteFriendRequestResp extends SuccessResp {}

export interface UserProfileUpdateReq {
    picture?: string;
    name?: string;
    location?: string;
    bio?: string;
}

export interface UserProfileUpdateResp extends SuccessResp {}

export interface FriendRequestAcceptReq {
    email: string;
}

export interface FriendRequestAcceptResp extends SuccessResp {}
