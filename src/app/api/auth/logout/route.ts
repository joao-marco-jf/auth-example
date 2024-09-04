import { deleteSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        deleteSession();
        return NextResponse.redirect(new URL('/auth/signin', request.nextUrl));
    } catch (error) {
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}