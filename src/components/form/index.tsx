"use client"

import { useRouter } from "next/navigation";
import Button from "./button";
import Input from "./input";
import { useState } from "react";
import { FormState } from "@/lib/definitions";

interface SignFormProps {
    type: 'signin' | 'signup';
}

export default function SignForm(props: SignFormProps) {
    const router = useRouter()

    const [state, setState] = useState<FormState>()
    const [pending, setPending] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setPending(true);

        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        
        await fetch(`/api/auth/${props.type}`, {
            method: 'POST',
            body: formData
        }).then(async (response) => {
            const data = await response.json();
            
            if(response.status == 200) {
                router.push('/dashboard');
            }

            setState(data);
        }).catch((error) => {
            console.error('An unexpected error occurred:', error);
            setPending(false);
        })
    }


    if(props.type === 'signin') {
        return (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold">Sign In</h1>
                <div className="flex flex-col gap-4">
                    <Input width="300px" id="email" type="email" label="email" placeholder="example@email.com"/>
                    <Input width="300px" id="password" type="password" label="password" placeholder="********"/>
                </div>
                <Button isPending={pending} value={pending ? 'Loading...' : 'Sign In'}/>
            </form>
        )
    } else {
        return (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold">Sign Up</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <Input width="175px" id="firstname" type="text" label="First Name" placeholder="John"/>
                        <Input width="175px" id="lastname" type="text" label="Last Name" placeholder="Smith"/>
                    </div>
                    <Input id="email" type="email" label="Email" placeholder="example@email.com" description="*Enter your email"/>
                    <Input id="password" type="password" label="Password" placeholder="********" 
                    description="
                        x At least 8 characters<br/>
                        x Must contain at least one letter<br/>
                        x Must contain at least one number<br/>
                        x Must contain at least one special character"
                    />
                </div>
                <Button isPending={pending} value={pending ? 'Submitting...' : 'Sign Up'}/>
            </form>
        )
    }
}