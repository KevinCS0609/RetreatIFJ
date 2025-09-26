import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;

  if (url === "/login") {
    if (token) {
        try {
            await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
            return NextResponse.redirect(new URL("/", req.url));
        } catch (err) {
        }
    }
    return NextResponse.next();
  }

  if (!token && (url.startsWith("/admin") || url.startsWith("/cashier"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    if (url.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (url.startsWith("/cashier") && payload.role !== "kasir") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|.*\\..*).*)',
  ],
};


// import { NextRequest, NextResponse } from 'next/server'

//  export function middleware(request) {
// //   return NextResponse.redirect(new URL('/login', request.url))
//     // const {pathname} = request.nextUrl

//     // const token = request.cookies.get('token')?.value

//     // if(!token){
//     //     return NextResponse.redirect(new URL('/login', request.url))
//     // }
//     // // console.log('Middleware executed', pathname)

//     // return NextResponse.next(); //lanjutkan kalo ada token

//     // if(pathname.startsWith('/login')){
//     //     console.log('Login page, allow access')
//     // }

//     // if(request.nextUrl.pathname.startsWith('/')){
//     //     return NextResponse.redirect(new URL('/login', request.url));
//     // }
// }

// export const config = {
//     matcher: ['/', '/admin/:path*', '/user/:path*', '/login'],
// };
