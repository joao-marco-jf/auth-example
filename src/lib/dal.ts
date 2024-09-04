import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from './session'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)

    if(!session?.sub) {
        redirect('/auth/signin')
    }

    return { isAuth: true, userId: session.sub }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if(!session) return null

    try {
        return await prisma.users.findUnique({
            where: {id: parseInt(session.userId)}
        })
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})