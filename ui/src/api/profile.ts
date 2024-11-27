import { error } from "console"
import { baseUrl, getHeaders } from "./common"


export type ProfileResp = {
  email : string,
  name : string
}

export const getProfile = async (): Promise<ProfileResp> => {

  const url = baseUrl + 'profile';
  const resp = await fetch(url ?? "",{
    method : "GET",
    headers: getHeaders(),
  })

  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  const apiResp = await resp.json()
  console.log("API_RESP",apiResp);
  return apiResp as ProfileResp;
}


export type FrinedsListResp = 
  {
    friends: Friend[]
  , friendRequests: FriendRequest[]
  }

export type Friend = {
  email : string
, name : string
}


export type FriendRequest = {
  email: string
, name: string
}

export const getFriendsList = async (): Promise<FrinedsListResp> => {
  const url = baseUrl + 'friend/list';
  const resp = await fetch(url ?? "", {
    method: "GET",
    headers: getHeaders(),
  })

  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }

  const apiResp = await resp.json()
  return apiResp as FrinedsListResp;
}

export const getSearchResult = async (key: string): Promise<Friend[]> => {
  const url = baseUrl + 'user/search';
  const resp = await fetch(url ?? "", {
    method: "GET",
    headers: getHeaders(),
  })

  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }

  const apiResp = await resp.json()
  return apiResp as Friend[];
}