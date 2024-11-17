// src/server.ts
import { error } from 'console';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { getUserDetails, setupDB, StreamerDB, updateUser, User } from './mongo';
require('dotenv').config()

const app = express();
const PORT = 9999;


// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

// Initialize Passport and session
app.use(passport.initialize({
  userProperty: 'user'
}
));
app.use(passport.session());

// Configure Passport to use Google strategy
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
      
      const user: User = {
        email : email,
        userName : profile.username ?? ""
      }

      const userResp = await getUserDetails(email);
      !userResp && await updateUser(user);
      
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Profile, done) => done(null, user));

// Route to trigger Google authentication
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  (req: Request, resp: Response) =>{
    const user = req.user as any; // Assuming user object from Passport
    console.log("User ", user);
    const name = encodeURIComponent(user.displayName);
    const email = encodeURIComponent(user.emails[0].value);
    resp.redirect(`http://localhost:3000/home?name=${name}&email=${email}`);
  }
);

app.get('/profile', (req: Request, resp: Response) => {
  console.log(req.isAuthenticated());
  console.log(req.user);
  if(req.isAuthenticated()){
    resp.send("Homeee")
    return;
  }
  resp.send("Not Authhhh");
})

app.get('/logout', (req: Request, resp: Response, next: NextFunction) => {
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

// Basic route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World! The TypeScript server is running!');
});



// Start the server
app.listen(PORT, async () => {
  await StreamerDB.getInstance();
  console.log(`Server is running on http://localhost:${PORT}`);
});

