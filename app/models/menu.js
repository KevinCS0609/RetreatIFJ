import clientPromise from "../lib/mongodb";

export async function getMenus() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("menus").find({}).toArray();
}

export async function getMenuById(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("menus").findOne({ _id: id });
}

export async function createMenu(menu) {
  const client = await clientPromise;
  const doc = {
    ...menu,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return client.db(process.env.MONGODB_DB).collection("menus").insertOne(doc);
}

export async function updateMenu(id, data) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("menus").updateOne(
    { _id: id },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteMenu(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("menus").deleteOne({ _id: id });
}
