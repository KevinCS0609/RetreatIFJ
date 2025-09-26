import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  // 1. Mengambil header di App Router
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Token tidak ditemukan" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Akses ditolak. Bukan admin." },
        { status: 403 }
      );
    }

    // 2. Menggunakan NextResponse untuk mengirim response
    return NextResponse.json({ message: "Halo Admin!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
  }
}