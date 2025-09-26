import clientPromise from "../lib/mongodb";

export async function getProducts() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("products").find({}).toArray();
}

export async function getProductById(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("products").findOne({ _id: id });
}

export async function createProduct(product) {
  const client = await clientPromise;
  const doc = {
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return client.db(process.env.MONGODB_DB).collection("products").insertOne(doc);
}

export async function updateProduct(id, data) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("products").updateOne(
    { _id: id },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteProduct(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("products").deleteOne({ _id: id });
}
