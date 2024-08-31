import { FormState, SignupFormSchema } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import { PrismaClient } from '@prisma/client'
import { redirect } from "next/navigation";

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

export async function signup(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    });

    if(!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }

    const { firstname, lastname, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            firstname,
            lastname,
            email,
            password: hashedPassword,
        }
    })

    if(!user) {
        return { message: 'An error occurred while creating your account.' }
    }

    await createSession(user.id.toString());
    redirect('/profile');
}

export async function logout() {
    deleteSession();
    redirect('/login');
}