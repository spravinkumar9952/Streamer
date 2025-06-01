import { UserNotFoundError } from "../db/errors/users";
import { RoomNotFoundError } from "../db/errors/streamingRoom";
import { NotOwnerError } from "../db/errors/streamingRoom";
import { UserNotFriendError } from "../db/errors/users";
import { ErrorResp } from "./common";

export const getStatusCode = (error: unknown) => {
    if (error instanceof Error) {
        if (error instanceof UserNotFoundError) {
            return 404;
        } else if (error instanceof UserNotFriendError) {
            return 400;
        } else if (error instanceof RoomNotFoundError) {
            return 404;
        } else if (error instanceof NotOwnerError) {
            return 403;
        }
        return 500;
    }
    return 500;
};

export const getErrorMessage = (error: unknown): ErrorResp => {
    if (error instanceof Error) {
        if (error instanceof UserNotFoundError) {
            return { message: "USER_NOT_FOUND", description: error.message };
        } else if (error instanceof UserNotFriendError) {
            return { message: "USER_NOT_FRIEND", description: error.message };
        } else if (error instanceof RoomNotFoundError) {
            return { message: "ROOM_NOT_FOUND", description: error.message };
        } else if (error instanceof NotOwnerError) {
            return { message: "NOT_OWNER", description: error.message };
        }
        return { message: "INTERNAL_SERVER_ERROR", description: error.message };
    }
    return { message: "INTERNAL_SERVER_ERROR", description: "Unknown error" };
};
