import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        console.error(`Environment variable ${key} is not set`);
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
};

// Server configuration
export const MONGO_CONNECTION_STR = getEnvVar("MONGO_CONNECTION_STR");
export const UI_BASE_URL = getEnvVar("UI_BASE_URL");
export const HTTP_PORT = parseInt(getEnvVar("HTTP_PORT"));
export const SOCKET_PORT = parseInt(getEnvVar("SOCKET_PORT"));
export const SESSION_SECRET = getEnvVar("SESSION_SECRET");
export const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnvVar("GOOGLE_CLIENT_SECRET");
export const UI_REDIRECT_URL = getEnvVar("UI_REDIRECT_URL");
export const SECRET_KEY = getEnvVar("SECRET_KEY");
export const GOOGLE_CALLBACK_URL = getEnvVar("GOOGLE_CALLBACK_URL");

// Log environment variables in development
if (process.env.NODE_ENV === "development") {
    console.log("Server environment variables loaded:", {
        MONGO_CONNECTION_STR,
        UI_BASE_URL,
        HTTP_PORT,
        SOCKET_PORT,
        SESSION_SECRET,
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        UI_REDIRECT_URL,
        SECRET_KEY,
        GOOGLE_CALLBACK_URL,
    });
}
