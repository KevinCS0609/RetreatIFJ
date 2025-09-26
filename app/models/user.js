import clientPromise from "../lib/mongodb";

export async function getUsers() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("users").find({}).toArray();
}

export async function getUserById(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("users").findOne({ _id: id });
}

export async function createUser(user) {
  const client = await clientPromise;
  const doc = {
    ...user,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return client.db(process.env.MONGODB_DB).collection("users").insertOne(doc);
}

export async function updateUser(id, data) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("users").updateOne(
    { _id: id },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteUser(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("users").deleteOne({ _id: id });
}