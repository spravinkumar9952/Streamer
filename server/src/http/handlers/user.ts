import { acceptFriendRequest, addFrinedRequst, getFriends, getUserDetails, matchUsersWithRegex } from "../../db/users";
import express, { NextFunction, Request, Response } from 'express';

export const profileHandler = async (req: Request, resp: Response) => {
  const user = req.user as { email: string };
  const userDBResp = await getUserDetails(user.email);
  console.log("UserResp", userDBResp, user.email);

  if (userDBResp) {
    resp.send({
      email: userDBResp.email,
      name: userDBResp.userName
    })
  } else {
    resp.status(404).send("User not found");
  }
}


export const handleUserSearch = async (req : Request, resp : Response) => {
  const searchKey = req.query.searchKey;
  const regex = "^" + searchKey;
  const matchedUsers = await matchUsersWithRegex(regex);

  const result : {email : string, name : string}[] = matchedUsers.map(item => {return {email : item.email, name : item.userName}});
  resp.send(result);
}


export const handleFriendRequestSent = async (req: Request, resp: Response) => {
  console.log("Inside_handleFriendRequestSent");
  const to = req.body.email;
  const user = req.user as { email: string }
  const from = user.email;
  try{
    await addFrinedRequst(from, to);
    resp.status(200).send("OK");
  }catch(err){
    resp.status(500).send(err);
  }
}

export const handleFriendRequestAccept = async (req: Request, resp: Response)  => {
  const to = req.body.email;
  const user = req.user as { email: string }
  const from = user.email;

  try{
    await acceptFriendRequest(from, to);
    resp.status(200).send("OK");
  } catch (err) {
    resp.status(500).send(err);
  }
}

export const handleFriendList = async (req: Request, resp: Response) => {
  const user = req.user as { email: string };

  try{
    const friendsEmail = await getFriends(user.email);
    const friendsList = [] ;
    const friendRequestsList = []

    for (let email of friendsEmail){
      const user = await getUserDetails(email);
      console.log("user", user);
      friendsList.push({
        email: email
        , name: user?.userName
      })
    }

    const userDetails = await getUserDetails(user?.email);

    if (userDetails?.frinedRequestsRecieved){
      for (let email of userDetails?.frinedRequestsRecieved) {
        const user = await getUserDetails(email);
        friendRequestsList.push({
          email: email
        , name: user?.userName
        })
      }
    }

    const friendListResp = {
      friends: friendsList
    , friendRequests: friendRequestsList
    }



    resp.status(200).send(friendListResp);
  }catch(err){
    throw err;
  }
}