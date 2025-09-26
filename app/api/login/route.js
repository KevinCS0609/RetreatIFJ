import clientPromise from "../../lib/mongodb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login berhasil",
      role: user.role,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}




// import { sign } from 'jsonwebtoken';
// import { serialize } from 'cookie';
// import { NextResponse } from 'next/server';

// const SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key';

// export async function POST(request) {
//   const body = await request.json();
//   const { username, password } = body;

//   if (username === 'admin' && password === 'admin') {
//     const token = sign(
//       { username: username }, 
//       SECRET_KEY,
//       { expiresIn: '1h' }
//     );

//     const serializedCookie = serialize('sessionToken', token, {
//       httpOnly: true, 
//       secure: process.env.NODE_ENV === 'production', 
//       sameSite: 'strict', 
//       maxAge: 60 * 60, // Masa berlaku cookie dalam detik (1 jam)
//       path: '/', 
//     });
//     return NextResponse.json(
//       { message: 'Login berhasil' },
//       {
//         status: 200,
//         headers: {
//           'Set-Cookie': serializedCookie,
//         },
//       }
//     );

//   } else {
//     return NextResponse.json(
//       { message: 'Username atau password salah' },
//       { status: 401 }
//     );
//   }
// }