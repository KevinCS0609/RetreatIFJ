import clientPromise from "../lib/mongodb";

export async function getOrders() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("orders").find({}).toArray();
}

export async function getOrderById(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("orders").findOne({ _id: id });
}

export async function createOrder(order) {
  const client = await clientPromise;
  const doc = {
    ...order,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return client.db(process.env.MONGODB_DB).collection("orders").insertOne(doc);
}

export async function updateOrder(id, data) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("orders").updateOne(
    { _id: id },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteOrder(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("orders").deleteOne({ _id: id });
}
