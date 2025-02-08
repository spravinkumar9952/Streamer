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
import { createStreamingRoom, deleteStreamingRoom, getStreamingRoomsHandler } from "./handlers/streamingRoom";

const app = express();
const PORT = 9999;

app.use(express.json());

app.use(
    cors({
        origin: process.env.UI_BASE_URL,
        credentials: true,
    })
);

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
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Inside GoogleStrategy", profile);
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
app.post("/stream/rooms/delete", verifyToken, deleteStreamingRoom);
app.get("/user/search", verifyToken, handleUserSearch);
app.get("/user/profile", verifyToken, handleUserProfile);

app.post("/friend/request/sent", verifyToken, handleFriendRequestSent);
app.post("/friend/request/accept", verifyToken, handleFriendRequestAccept);
app.get("/friend/list", verifyToken, handleFriendList);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World! The TypeScript server is running!");
});

app.get("/friends", verifyToken, (req: Request, res: Response) => {});

app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

app.listen(PORT, async () => {
    await StreamerDB.getInstance();
    console.log(`Server is running on http://localhost:${PORT}`);
});
