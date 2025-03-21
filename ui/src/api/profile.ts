import { error } from "console";
import { baseUrl, getHeaders } from "./common";

export const getProfile = async (): Promise<ProfileResp> => {
    const url = baseUrl + "profile";
    const resp = await fetch(url ?? "", {
        method: "GET",
        headers: getHeaders(),
    });

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const apiResp = await resp.json();
    console.log("API_RESP", apiResp);
    return apiResp as ProfileResp;
};

export const getUserByEmail = async (key: string): Promise<Friend> => {
    const url = baseUrl + "user/profile?email=" + key;
    const resp = await fetch(url ?? "", {
        method: "GET",
        headers: getHeaders(),
    });

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const apiResp = await resp.json();
    return apiResp as Friend;
};

export type FriendsListResp = {
    friends: Friend[];
    friendRequests: FriendRequest[];
};

export type Friend = {
    email: string;
    name: string;
};

export type FriendRequest = {
    email: string;
    name: string;
};

export const getFriendsList = async (): Promise<FriendsListResp> => {
    const url = baseUrl + "friend/list";
    const resp = await fetch(url ?? "", {
        method: "GET",
        headers: getHeaders(),
    });

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const apiResp = await resp.json();
    return apiResp as FriendsListResp;
};

const handleUnAuthorize = (statuscode: number) => {
    if (statuscode === 401 || statuscode === 403) {
        window.location.href = "/login";
    }else{
        throw new Error(`HTTP error! status: ${statuscode}`);
    }
};
export interface ProfileResp {
    email: string;
    name: string;
}
export interface UserSearchResp {
    list: ProfileResp[];
}

export const getSearchResult = async (key: string): Promise<UserSearchResp> => {
    const url = baseUrl + "user/search?searchKey=" + key;
    const resp = await fetch(url ?? "", {
        method: "GET",
        headers: getHeaders(),
    });

    if (!resp.ok) {
        handleUnAuthorize(resp.status);
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const apiResp = await resp.json();
    console.log("getSearchResult", apiResp);
    return apiResp as UserSearchResp;
};

export const giveFriendRequest = async (email: string): Promise<void> => {
    const url = baseUrl + "friend/request/sent";
    const resp = await fetch(url ?? "", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email: email }),
    });

    if (!resp.ok) {
        handleUnAuthorize(resp.status);
        throw new Error(`HTTP error! status: ${resp.status}`);
    }
};

export const acceptFriendRequest = async (email: string): Promise<void> => {
    const url = baseUrl + "friend/request/accept";
    const resp = await fetch(url ?? "", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email: email }),
    });

    if (!resp.ok) {
        handleUnAuthorize(resp.status);
        throw new Error(`HTTP error! status: ${resp.status}`);
    }
};
