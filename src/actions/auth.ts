import { FormState, SignupFormSchema } from "@/lib/definitions";
import { PrismaClient } from '@prisma/client'

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

    // TODO:
    // 4. Create user session
    // 5. Redirect user
}