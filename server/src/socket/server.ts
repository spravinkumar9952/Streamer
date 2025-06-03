import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createServer } from "http";
import { SOCKET_PORT, UI_BASE_URL } from "../utils/env";
import "../utils/logger";
// import { redisClient } from "../db/redis";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    path: "/socket",
    transports: ["websocket"],
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

httpServer.listen(SOCKET_PORT, "0.0.0.0", () => {
    console.log(`Socket server running on port ${SOCKET_PORT}`);
});

// Socket.IO connection handling
io.on("connection", async (socket) => {
    const email = socket.handshake.query.email as string;
    const socketId = socket.id;
    const roomId = socket.handshake.query.roomId as string;
    console.log("A user connected: with email", email, "and socketId", socketId, "and roomId", roomId);

    if (roomId && email) {
        const key = `${roomId}:${email}`;
        // await redisClient.set(key, socketId);
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

    socket.on("updateVideoUrl", (roomId, email, videoUrl) => {
        socket.to(roomId).emit("updateVideoUrl", videoUrl);
    });

    socket.on("disconnect", async (roomId, email) => {
        const key = `${roomId}:${email}`;
        // await redisClient.del(key);
        console.log("A user disconnected:", socket.id);
    });
});
