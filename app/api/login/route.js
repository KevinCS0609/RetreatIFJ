import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key';

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === 'admin' && password === 'admin') {
    const token = sign(
      { username: username }, 
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const serializedCookie = serialize('sessionToken', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 60 * 60, // Masa berlaku cookie dalam detik (1 jam)
      path: '/', 
    });
    return NextResponse.json(
      { message: 'Login berhasil' },
      {
        status: 200,
        headers: {
          'Set-Cookie': serializedCookie,
        },
      }
    );

  } else {
    return NextResponse.json(
      { message: 'Username atau password salah' },
      { status: 401 }
    );
  }
}