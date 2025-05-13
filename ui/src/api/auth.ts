import { HTTP_SERVER_URL } from "../utils/env";

export const authGoogle = () => {
    const baseUrl = HTTP_SERVER_URL;
    console.log("Auth Google", baseUrl);
    const endPoint = `${baseUrl}/auth/google`;
    window.location.href = endPoint;
};
