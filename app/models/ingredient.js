import clientPromise from "../lib/mongodb";

export async function getIngredients() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("ingredients").find({}).toArray();
}

export async function getIngredientById(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("ingredients").findOne({ _id: id });
}

export async function createIngredient(ingredient) {
  const client = await clientPromise;
  const doc = {
    ...ingredient,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return client.db(process.env.MONGODB_DB).collection("ingredients").insertOne(doc);
}

export async function updateIngredient(id, data) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("ingredients").updateOne(
    { _id: id },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteIngredient(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("ingredients").deleteOne({ _id: id });
}
