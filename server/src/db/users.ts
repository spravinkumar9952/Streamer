import { StreamerDB } from "./mongo";

export type User = {
  email: string,
  userName: string,
}


export const getUserDetails = async (email: string) => {
  const userCollection = StreamerDB.db.collection('users');
  const query = { email: email };
  const resp = await userCollection.findOne(query);
  console.log("resp", resp);
  return resp ? resp as unknown as User : null;
}

export const insertUser = async (user: User) => {
    const userCollection = StreamerDB.db.collection('users');
    const query = user;
    await userCollection.insertOne(query);
}

export const updateUser = async (user: User) => {
  const userCollection = StreamerDB.db.collection('users');
  await userCollection.replaceOne(user, { email: user.email });
}