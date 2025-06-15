import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { WEBRTC_PORT } from "../utils/env";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

type RoomMap = Record<string, Record<string, string>>;
const rooms: RoomMap = {};
const TAG = "SignalingServer";

io.on("connection", (socket: Socket) => {
    console.log(TAG, "User connected:", socket.id);

    socket.on("join", (roomId: string, email: string) => {
        if (!rooms[roomId]) rooms[roomId] = {};
        // if (rooms[roomId].length >= 2) {
        //     socket.emit("room_full");
        //     return;
        // }

        rooms[roomId][email] = socket.id;
        socket.join(roomId);
        console.log(TAG, `${socket.id} joined room ${roomId}`);
        console.log(TAG, rooms[roomId]);

        const otherUser = Object.keys(rooms[roomId]).find((id) => id !== email);
        if (otherUser) {
            console.log(TAG, `${socket.id} found other user ${otherUser}`);
            socket.emit("other-user", rooms[roomId][otherUser], otherUser);
            io.to(rooms[roomId][otherUser]).emit("user-joined", socket.id, email);
        }

        socket.on("offer", ({ to, offer }: { to: string; offer: RTCSessionDescriptionInit }, email: string) => {
            console.log(TAG, `${socket.id} sent offer to ${to}`);
            io.to(to).emit("offer", { from: socket.id, offer }, email);
        });

        socket.on("answer", ({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }, email: string) => {
            console.log(TAG, `${socket.id} sent answer to ${to}`);
            io.to(to).emit("answer", { from: socket.id, answer }, email);
        });

        socket.on(
            "ice-candidate",
            ({ to, candidate }: { to: string; candidate: RTCIceCandidateInit }, email: string) => {
                console.log(TAG, `${socket.id} sent ice candidate to ${to}`);
                io.to(to).emit("ice-candidate", { from: socket.id, candidate }, email);
            }
        );

        socket.on("disconnect", () => {
            console.log(TAG, "User disconnected:", socket.id);
            const email = Object.keys(rooms[roomId]).find((id) => rooms[roomId][id] === socket.id);
            if (email) {
                socket.to(rooms[roomId][email]).emit("user-disconnected", email);
                delete rooms[roomId][email];
            }
        });
    });
});

server.listen(WEBRTC_PORT, () => {
    console.log(`Signaling server listening on http://localhost:${WEBRTC_PORT}`);
});
