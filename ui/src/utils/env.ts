export const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        console.error(`Environment variable ${key} is not set`);
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
};

export const SOCKET_SERVER_URL = getEnvVar("REACT_APP_SOCKET_SERVER_URL");
export const HTTP_SERVER_URL = getEnvVar("REACT_APP_HTTP_SERVER_URL");
export const WEBRTC_SERVER_URL = getEnvVar("REACT_APP_WEBRTC_SERVER_URL");

// Log environment variables in development
if (process.env.NODE_ENV === "development") {
    console.log("Environment variables loaded:", {
        SOCKET_SERVER_URL,
        HTTP_SERVER_URL,
        WEBRTC_SERVER_URL,
        allEnv: process.env,
    });
}
