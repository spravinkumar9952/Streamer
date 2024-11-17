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


export const setupDB = async () => {
  const connectionStr = process.env.MONGO_CONNECTION_STR ?? ""; 
  const dbClient = new MongoClient(connectionStr);
  await dbClient.connect();
}


export type User = {
  email: string,
  userName: string,
}


export const getUserDetails = async (email : string) => {
  try{
    // await dbClient.connect();

    const userCollection = StreamerDB.db.collection('users');

    const query = {email : email};
    const resp  =  await userCollection.findOne(query);

    console.log("Fetch users", resp);

    return resp ? resp as unknown as  User : null;
  }finally{
    // dbClient.close();
  }
}
 



export const updateUser = async (user : User) => {
  try {
    // await dbClient.connect();

    const userCollection = StreamerDB.db.collection('users');

    const query = user;

    const resp = await userCollection.insertOne(query);
    console.log("Update resp", resp);

  }finally{
    // dbClient.close();
  }
}
