"use client"

import { useRouter } from "next/navigation"

export default function LogoutButton() {
    const router = useRouter()

    return (
        <button onClick={async () => {
            await fetch('/api/auth/logout').then(() => {
                router.push('/auth/signin')
            })
        }}>Logout</button>
    )
}