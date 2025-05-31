import { HTTP_SERVER_URL } from "../utils/env";

export const authGoogle = () => {
    const baseUrl = HTTP_SERVER_URL;
    console.log("Auth Google", baseUrl);
    const endPoint = `${baseUrl}/auth/google`;
    window.location.href = endPoint;
};

export const handleUnAuthorize = (statuscode: number) => {
    if (statuscode === 401 || statuscode === 403) {
        window.location.href = "/login";
    } else {
        throw new Error(`HTTP error! status: ${statuscode}`);
    }
};
