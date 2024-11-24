// src/server.ts
import { error } from 'console';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { StreamerDB } from './db/mongo';
import { getUserDetails, insertUser, updateUser } from './db/users'
require('dotenv').config()
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = 9999;

app.use(cors({
  origin: process.env.UI_BASE_URL, 
  credentials: true, 
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(passport.initialize({
  userProperty: 'user'
}
));
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Inside GoogleStrategy", profile);
      const emails = profile.emails as {value: string; verified: boolean;}[]
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

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

const  verifyToken = (req : Request, res : Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }

  const SECRET_KEY = process.env.SECRET_KEY ?? "";

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).send('Invalid Token');
      return;
    }
    const email:string = (decoded as {email : string}).email;
    req.user = { ...(decoded as Object), email: decodeURIComponent(email)}; // Attach user data to request
    next();
  });
}

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}),
  (req: Request, resp: Response) =>{
    const user = req.user as any; 

    const name = encodeURIComponent(user.displayName);
    const email = encodeURIComponent(user.emails[0].value);

    const SECRET_KEY = process.env.SECRET_KEY ?? "";
    const token = jwt.sign({email: email},SECRET_KEY,{ expiresIn: '1h' });

    resp.redirect(`{process.env.UI_REDIRECT_URL}?name=${name}&email=${email}&token=${token}`);
  }
);

app.get('/profile', verifyToken, async (req: Request, resp: Response) => {
  const user = req.user as {email : string};
  const userDBResp = await getUserDetails(user.email);
  console.log("UserResp", userDBResp, user.email);

  if(userDBResp){
    resp.send({
      email: userDBResp.email,
      name : userDBResp.userName
    })
  }else{
    resp.status(404).send("User not found");
  }
})

app.get('/logout', verifyToken, (req: Request, resp: Response, next: NextFunction) => {
  req.logOut({ keepSessionInfo: false}, (error) => {
    next(error);
    console.log(error);
    req.session.destroy((err) => {
      console.log(error);
      next(error);
    })
  });
  resp.send("sucess");
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World! The TypeScript server is running!');
});

app.get('/friends', verifyToken, (req : Request, res: Response) => {

})

app.listen(PORT, async () => {
  await StreamerDB.getInstance();
  console.log(`Server is running on http://localhost:${PORT}`);
});

