// src/server.ts
import { error } from "console";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { StreamerDB } from "../db/mongo";
import { getStreamingRooms, getUserDetails, insertUser, updateUser } from "../db/users";
require("dotenv").config();
import jwt from "jsonwebtoken";
import cors from "cors";
import {
    handleFriendList,
    handleFriendRequestAccept,
    handleFriendRequestSent,
    handleUserProfile,
    handleUserSearch,
    profileHandler,
} from "./handlers/user";
import { authGoogleCallback, logOutHandler, verifyToken } from "./handlers/auth";
import {
    createStreamingRoom,
    deleteStreamingRoom,
    getStreamingRoomsHandler,
    updateVideoUrl,
} from "./handlers/streamingRoom";
import "../utils/logger";
import { HTTP_PORT, UI_BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "../utils/env";

const app = express();

// Middleware
app.use(
    cors({
        origin: UI_BASE_URL,
        credentials: true,
    })
);
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default-secret",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use(
    passport.initialize({
        userProperty: "user",
    })
);
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const emails = profile.emails as { value: string; verified: boolean }[];
            const email = emails[0].value;

            const userResp = await getUserDetails(email);
            if (userResp) await updateUser(email, profile.displayName);
            else await insertUser(email, profile.displayName);

            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Profile, done) => done(null, user));

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authGoogleCallback);
app.get("/logout", verifyToken, logOutHandler);

app.get("/profile", verifyToken, profileHandler);
app.get("/stream/rooms/list", verifyToken, getStreamingRoomsHandler);
app.post("/stream/rooms/create", verifyToken, createStreamingRoom);
app.delete("/stream/rooms/delete", verifyToken, deleteStreamingRoom);
app.post("/stream/rooms/update-url", verifyToken, updateVideoUrl);

app.get("/user/search", verifyToken, handleUserSearch);
app.get("/user/profile", verifyToken, handleUserProfile);

app.post("/friend/request/sent", verifyToken, handleFriendRequestSent);
app.post("/friend/request/accept", verifyToken, handleFriendRequestAccept);
app.get("/friend/list", verifyToken, handleFriendList);

app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK");
});

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World! The TypeScript server is running!");
});

app.get("/friends", verifyToken, (req: Request, res: Response) => {});

app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

// Start server
app.listen(HTTP_PORT, async () => {
    await StreamerDB.getInstance();
    console.log(`HTTP server running on port ${HTTP_PORT}`);
});
