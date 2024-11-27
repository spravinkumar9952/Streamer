import mongoose, { model, Schema } from "mongoose"
import { UserModel } from "./users";
import { UUID } from "mongodb";
import { v4 as uuidv4 } from 'uuid';



interface StreamingRoom extends Document {
  _id: UUID,
  created_at: Date,
  joinedUsers: string [],
  name : string,
  videoUrl : string,
  createdBy : string
}

export const StreamingRoomSchema = new Schema<StreamingRoom>({
  _id: {type : UUID, required: true}
, created_at: {type:  Date, default: Date.now()}
, joinedUsers: {type : [String], default: []}
, name : {type: String, required: true}
, videoUrl : {type: String}
, createdBy: {}
})


export const StreamingRoomModel = model<StreamingRoom>("StreamingRoom", StreamingRoomSchema);

export const createRoom = async (roomName: string, users : [string], createdBy : string) => {
  const newRoom = new StreamingRoomModel({
    _id: uuidv4()
  , joinedUsers: users
  , name: roomName
  , createdBy: createdBy
  })

  await newRoom.save();
}

export const addPerson = async  (roomId : string , usersEmail : [string]) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    await StreamingRoomModel.findByIdAndUpdate({ _id: roomId }, { $addToSet: { joinedUsers: usersEmail }});
    usersEmail.forEach(async userEmail => await UserModel.findByIdAndUpdate({email : userEmail}, { $addToSet : {joinedStreamingRooms : roomId}}))
    await session.commitTransaction()
  }catch(err){
    await session.abortTransaction();
    throw err;
  }
}


export const updateVideoURL = async (roomId: string, videoUrl : string) => {
  await StreamingRoomModel.findByIdAndUpdate({ _id: roomId }, { videoUrl: videoUrl});
}

