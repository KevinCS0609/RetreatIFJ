import clientPromise from "../lib/mongodb";

export async function getExpenses() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("expenses").find({}).toArray();
}

export async function getExpenseById(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("expenses").findOne({ _id: id });
}

export async function createExpense(expense) {
  const client = await clientPromise;
  const doc = {
    ...expense,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return client.db(process.env.MONGODB_DB).collection("expenses").insertOne(doc);
}

export async function updateExpense(id, data) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("expenses").updateOne(
    { _id: id },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteExpense(id) {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection("expenses").deleteOne({ _id: id });
}
