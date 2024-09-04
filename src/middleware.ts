import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/session"

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/auth/signin', '/auth/signup', '/']

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)

    if(isProtectedRoute && !session?.sub) {
        return NextResponse.redirect(new URL('/auth/signin', request.nextUrl))
    }

    if(
        isPublicRoute &&
        session?.sub &&
        !request.nextUrl.pathname.startsWith('/dashboard')
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}