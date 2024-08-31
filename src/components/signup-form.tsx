"use client"

import { signup } from "@/actions/auth"
import { useActionState } from "react"

export default function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined);

    return(
        <form action={action}>
            <div>
                <label htmlFor="name">First Name</label>
                <input id="firstname"  name="firstname" placeholder="John"/>
            </div>
            {state?.errors?.firstname && <p>{state.errors.firstname}</p>}

            <div>
                <label htmlFor="name">Last Name</label>
                <input id="lastname" name="lastname" placeholder="Smith"/>
            </div>
            {state?.errors?.lastname && <p>{state.errors.lastname}</p>}

            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="johnsmith@email.com"/>
            </div>
            {state?.errors?.email && <p>{state.errors.email}</p>}

            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="********"/>
            </div>
            {state?.errors?.password && (
                <div>
                    <p>Password must: </p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button aria-disabled={pending} type="submit">
                {pending ? 'Submitting...' : 'Sign Up'}
            </button>
        </form>
    )
}