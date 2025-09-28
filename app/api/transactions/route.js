import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { customerName, items, subtotal, paymentMethod, total } =
      await req.json();

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data transaksi tidak lengkap" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const productIds = items.map((item) => new ObjectId(item.id));
    const products = await db
      .collection("products")
      .find({
        _id: { $in: productIds },
      })
      .toArray();

    // Cek ketersediaan stok
    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.id);

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Produk ${item.name} tidak ditemukan` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Stok ${item.name} tidak mencukupi. Tersedia: ${product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    try {
      // Object Transactions
      const transaction = {
        customerName: customerName.trim(),
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          subtotal: Number(item.price) * Number(item.quantity),
        })),
        subtotal: Number(subtotal),
        total: Number(total),
        paymentMethod,
        paymentStatus: "Completed",
        createdAt: new Date().toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        updatedAt: new Date().toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      // Simpan Transaksi
      const result = await db.collection("transactions").insertOne(transaction);

      // Update stock
      const bulkOperations = items.map((item) => ({
        updateOne: {
          filter: { _id: new ObjectId(item.id) },
          update: { $inc: { stock: -Number(item.quantity) } },
        },
      }));

      await db.collection("products").bulkWrite(bulkOperations);

      return NextResponse.json(
        {
          success: true,
          message: "Transaksi berhasil diproses!",
          transactionId: result.insertedId.toString(),
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Transaction failed:", error);
      return NextResponse.json(
        { message: error.message || "Gagal memproses pembelian" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { message: "Gagal memproses transaksi" },
      { status: 500 }
    );
  }
}

// GET ALL DATA TRANSACTIONS
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const transactions = await db
      .collection("transactions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const normalized = transactions.map((t) => ({
      id: t._id.toString(),
      customerName: t.customerName,
      items: t.items,
      subtotal: t.subtotal,
      total: t.total,
      paymentMethod: t.paymentMethod,
      paymentStatus: t.paymentStatus,
      createdAt: t.createdAt,
    }));

    return NextResponse.json(
      { success: true, data: normalized },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data transaksi" },
      { status: 500 }
    );
  }
}
