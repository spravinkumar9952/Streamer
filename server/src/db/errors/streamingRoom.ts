export class RoomNotFoundError extends Error {
    constructor(roomId: string) {
        super(`Room not found for id ${roomId}`);
    }
}

export class NotOwnerError extends Error {
    constructor(roomId: string) {
        super(`You are not the owner of this room ${roomId}`);
    }
}
