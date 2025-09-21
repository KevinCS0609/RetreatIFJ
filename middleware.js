import { NextRequest, NextResponse } from 'next/server'

 export function middleware(request) {
//   return NextResponse.redirect(new URL('/login', request.url))
    // const {pathname} = request.nextUrl

    // const token = request.cookies.get('token')?.value

    // if(!token){
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }
    // // console.log('Middleware executed', pathname)

    // return NextResponse.next(); //lanjutkan kalo ada token

    // if(pathname.startsWith('/login')){
    //     console.log('Login page, allow access')
    // }

    // if(request.nextUrl.pathname.startsWith('/')){
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }
}

export const config = {
    matcher: ['/', '/admin/:path*', '/user/:path*', '/login'],
};


 