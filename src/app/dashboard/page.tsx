import LogoutButton from "@/components/auth/logout/button";
import { getUser, verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await verifySession()
    
    if(!session){
        redirect('/auth/signin')
    } else {
        const user = await getUser()
        if(user) {
            return (
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, {user.firstname}</p>
                    <LogoutButton />
                </div>
            )
        }
    }

    return <div>Loading...</div>
}