import express from "express";
import http from "http";
import { Server } from "socket.io";
import { redisClient } from "../db/redis";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

server.listen(9998, () => {
    console.log("Server running on http://localhost:9998");
});

// Socket.IO connection handling
io.on("connection", async (socket) => {
    const email = socket.handshake.query.email as string;
    const socketId = socket.id;
    const roomId = socket.handshake.query.roomId as string;
    console.log("A user connected: with email", email, "and socketId", socketId, "and roomId", roomId);

    if (roomId && email) {
        const key = `${roomId}:${email}`;
        await redisClient.set(key, socketId);
        socket.join(roomId);
    }

    socket.on("play", async (roomId, email, time) => {
        socket.to(roomId).emit("play", time);
    });

    socket.on("pause", (roomId, email, time) => {
        socket.to(roomId).emit("pause", time);
    });

    socket.on("seek", (roomId, email, time) => {
        socket.to(roomId).emit("seek", time);
    });

    socket.on("onProgress", (roomId, email, time) => {
        // console.log("received onProgress to " + time);
        socket.to(roomId).emit("onProgress", time);
    });

    socket.on("disconnect", async (roomId, email) => {
        const key = `${roomId}:${email}`;
        await redisClient.del(key);
        console.log("A user disconnected:", socket.id);
    });
});
