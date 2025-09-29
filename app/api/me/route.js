import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Menggunakan jose seperti di middleware
import { cookies } from "next/headers";

export async function GET(req) {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Tidak ada token" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    // Payload berisi id, role, username
    return NextResponse.json({
      message: "User authenticated",
      user: {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      },
      role: payload.role // Mengirim role secara langsung juga untuk kemudahan
    }, { status: 200 });
  } catch (error) {
    console.error("Token verification failed:", error);
    // Hapus cookie yang tidak valid jika ada error
    cookies().delete("token"); 
    return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
  }
}