import SignForm from "@/components/form";

export default async function Signin() {
    return (
        <main className="flex h-screen p-8 px-64">
            <div className="flex w-full justify-center items-center">
                <SignForm type="signin" />
            </div>
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-black rounded-xl"/>
        </main>     
    )
}