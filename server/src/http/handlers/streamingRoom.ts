import express, { NextFunction, Request, Response } from "express";
import { getStreamingRooms } from "../../db/users";
import { createRoom, deleteRoom } from "../../db/streamingRoom";

export const getStreamingRoomsHandler = async (req: Request, res: Response) => {
    const user = req.user as { email: string };

    try {
        const rooms = await getStreamingRooms(user.email);
        res.send(rooms);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const createStreamingRoom = async (req: Request, res: Response) => {
    const user = req.user as { email: string };
    const body = req.body as { roomName: string; friends: string[] };
    const resp = await createRoom(user.email, body.friends, body.roomName);
    res.send({ id: resp });
};

export const deleteStreamingRoom = async (req: Request, res: Response) => {
    const user = req.user as { email: string };
    const body = req.body as { roomId: string };

    const resp = await deleteRoom(user.email);
};
