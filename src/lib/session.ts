import 'server-only'

import { JWTPayload, jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import { PrismaClient } from '@prisma/client';

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

const prisma = new PrismaClient();

export async function encrypt(payload: JWTPayload){
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256']
        })

        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}

export async function createSession(userId: string){
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const data = await prisma.sessions.create({
        data: {
            userid: parseInt(userId),
            expiresat: expiresAt
        }
    })

    const session = await encrypt({
        sub: data.id.toString(),
        exp: expiresAt.getTime()
    })

    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    })
}

export function deleteSession(){
    cookies().delete('session')
}