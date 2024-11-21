import { Db, MongoClient } from "mongodb";
import mongoose from "mongoose";

export class StreamerDB {
  private static instance : StreamerDB;
  public static db: Db;

  private constructor(){}

  private static async setUp(){
    const connectionStr = process.env.MONGO_CONNECTION_STR ?? "";
    await mongoose.connect(connectionStr);
    
    console.log("MongoDB connected");
  }

  public static async getInstance () : Promise<StreamerDB> {
    if(StreamerDB.instance){
      return StreamerDB.instance 
    }
    await this.setUp();
    return new StreamerDB();
  }
}