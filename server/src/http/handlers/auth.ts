import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const logOutHandler = (req: Request, resp: Response, next: NextFunction) => {
    req.logOut({ keepSessionInfo: false }, (error) => {
        next(error);
        console.error(error);
        req.session.destroy((err) => {
            console.error(error);
            next(error);
        });
    });
    resp.send("success");
};

export const authGoogleCallback = (req: Request, resp: Response) => {
    const user = req.user as any;

    const name = encodeURIComponent(user.displayName);
    const email = encodeURIComponent(user.emails[0].value);

    const SESSION_SECRET = process.env.SESSION_SECRET ?? "";
    const token = jwt.sign({ email: email }, SESSION_SECRET, { expiresIn: "1h" });
    const url = process.env.UI_REDIRECT_URL ?? "";

    resp.redirect(url + `?name=${name}&email=${email}&token=${token}`);
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
        res.status(401).send("Unauthorized");
        console.error(`User with the token ${token} authorized`);
        return;
    }

    const SESSION_SECRET = process.env.SESSION_SECRET ?? "";

    jwt.verify(token, SESSION_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).send("Invalid Token");
            return;
        }
        const email: string = (decoded as { email: string }).email;
        req.user = { ...(decoded as Object), email: decodeURIComponent(email) }; // Attach user data to request
        next();
    });
};
