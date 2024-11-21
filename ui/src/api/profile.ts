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