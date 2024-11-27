
import express, { NextFunction, Request, Response } from 'express';
import { getStreamingRooms } from '../../db/users';

export const getStreamingRoomsHandler = async (req : Request, res : Response) => {
  const user = req.user as { email: string };

  try{
    const rooms = await getStreamingRooms(user.email);
    res.send(rooms);
  }catch(err){
    res.status(500).send(err);
  }
}
