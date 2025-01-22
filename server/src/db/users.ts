import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface User extends Document {
  email: string,
  userName: string,
  frinedRequestsSent: string[],
  frinedRequestsRecieved : string[],
  friends: string[],
  joinedStreamingRooms : string[]
}

const UserSchema = new Schema<User>({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  frinedRequestsSent: { type: [String], default: [] },
  frinedRequestsRecieved: {type: [String], default: []},
  friends: { type: [String], default: [] },
  joinedStreamingRooms: { type: [String], default: [] }
});

export const UserModel = model<User>("User", UserSchema);

export const getUserDetails = async (email: string): Promise<User | null> => {
  return await UserModel.findOne({email:email});
}

export const insertUser = async (email : string, userName : string): Promise<void> => {
  const newUser = new UserModel(
    {
      userName : userName,
      email : email
    }
  )
  await UserModel.insertMany(newUser);
}

export const updateUser = async (email : string, userName : string | undefined) => {
  const userDetails = new UserModel();
  
  if (userName) userDetails.userName = userName;


  UserModel.updateOne({ email: email }, userDetails);
}


export const addFrinedRequst = async (from : string, to : string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    if(!(await UserModel.findOne({email: to}))){
      throw new Error(`User not exist with {to}`);
    }
    
    await UserModel.updateOne({ email: from }, { $addToSet: { frinedRequestsSent: to } })
    await UserModel.updateOne({ email: to }, {$addToSet : {frinedRequestsRecieved : from}})

    session.commitTransaction();
    console.log("Completed friend request");
  }catch(err){
    session.abortTransaction();
    throw err;
  }
}

export const acceptFriendRequest = async (personWhoAccepting : string, personWhoSent : string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try{
    const isFrinedRequestThere = await UserModel.findOne({ email: personWhoAccepting, frinedRequestsRecieved: personWhoSent })

    if (!isFrinedRequestThere){
      throw new Error("No frinend request found")
    }

    await UserModel.updateOne(
      { email: personWhoAccepting }, 
      { $pull: { frinedRequestsRecieved: personWhoSent}, $addToSet: {friends : personWhoSent} } 
    )

    await UserModel.updateOne(
      { email: personWhoSent },
      { $pull: { frinedRequestsSent: personWhoAccepting }, $addToSet: {friends : personWhoAccepting}}
    )

    // await UserModel.updateOne(
    //   { email: personWhoAccepting },
    //   { $pull: { frinedRequestsRecieved: personWhoSent }}
    // )

    // await UserModel.updateOne(
    //   { email: personWhoSent },
    //   { $pull: { frinedRequestsSent: personWhoAccepting }}
    // )

    session.commitTransaction();
  }catch(err){
    session.abortTransaction();
    throw err;
  }
}


export const getFriends = async (email : string ) => {
  const user = await UserModel.findOne({email : email})
  if(!user){
    throw new Error(`No user found with email {email}`);
  }
  return user.friends;
}


export const getStreamingRooms = async (userEmail: string) => {
  const userInfo = await UserModel.findOne({email : userEmail});
  if (!userInfo){
    throw new Error(`No user found with email {userEmail}`);
  }

  return userInfo.joinedStreamingRooms;
}


export const matchUsersWithRegex = async (regex: string) : Promise<User[]> => {
  // const resp = await UserModel.find({
  //   email: {
  //       $regex: regex,
  //       $options: 'i'
  //   }
  // });

  const resp = await UserModel.find();

  return resp;
}

