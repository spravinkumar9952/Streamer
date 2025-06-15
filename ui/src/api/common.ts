import { HTTP_SERVER_URL } from "../utils/env";
import Cookies from "js-cookie";

export const baseUrl = HTTP_SERVER_URL + "/";

export const getHeaders = () => {
    const cookie = Cookies.get("authToken");
    return {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/json",
    };
};
