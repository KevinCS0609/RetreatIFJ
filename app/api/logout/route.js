import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST() {
  const sessionCookieName = 'sessionToken';

  const expiredCookie = serialize(sessionCookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });

  return NextResponse.json(
    { message: 'Logout berhasil' },
    {
      status: 200,
      headers: {
        'Set-Cookie': expiredCookie,
      },
    }
  );
}