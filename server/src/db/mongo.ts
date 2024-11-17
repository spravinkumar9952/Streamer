import { Db, MongoClient } from "mongodb";

export class StreamerDB {
  private static instance : StreamerDB;
  public static db: Db;

  private constructor(){}

  private static async setUp(){
    const connectionStr = process.env.MONGO_CONNECTION_STR ?? "";
    const dbClient = new MongoClient(connectionStr);
    await dbClient.connect();
    StreamerDB.db = dbClient.db('streamer');
  }

  public static async getInstance () : Promise<StreamerDB> {
    if(StreamerDB.instance){
      return StreamerDB.instance 
    }
    await this.setUp();
    return new StreamerDB();
  }
}