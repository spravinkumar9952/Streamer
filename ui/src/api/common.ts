import { HTTP_SERVER_URL } from "../utils/env";
export const baseUrl = HTTP_SERVER_URL + "/";

export const getHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};
