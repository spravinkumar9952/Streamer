import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { StreamerDB } from "./mongo";



interface User extends Document {
  email: string,
  userName: string,
  frinedRequestsSent: string[],
  frinedRequestsRecieved : string[],
  friends: string[]
}

// Define a schema
const UserSchema = new Schema<User>({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  frinedRequestsSent: { type: [String], default: [] },
  frinedRequestsRecieved: {type: [String], default: []},
  friends: { type: [String], default: [] }
});

// Create a model
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
    await UserModel.updateOne({ email: from }, { $addToSet: { frinedRequestsSent: to } })
    await UserModel.updateOne({ email: to }, {$addToSet : {frinedRequestsRecieved : from}})

    session.commitTransaction();
  }catch(err){
    session.abortTransaction();
    throw err;
  }
}

export const acceptFriendRequest = async (personWhoAccepting : string, personWhoSent : string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try{
    const isFrinedRequestThere = await UserModel.findOne({ email: personWhoAccepting, frinedRequestsSent: personWhoSent })

    if (!isFrinedRequestThere){
      throw new Error("No frinend request found")
    }

    await UserModel.updateOne(
      { email: personWhoAccepting }, 
      { $pull: { frinedRequestsRecieved: personWhoSent}, $push: {friends : personWhoSent} } 
    )

    await UserModel.updateOne(
      { email: personWhoSent },
      { $pull: { frinedRequestsSent: personWhoAccepting }, $push: {friends : personWhoAccepting}}
    )
  }catch(err){
    session.abortTransaction();
    throw err;
  }
}

