import { baseUrl } from "./common";

type AuthGoogleReq = {

}

type AuthGoogleResp = {

}


export const authGoogle = () => {
  const endPoint = "http://localhost:9999/auth/google"
  window.location.href = endPoint;
}