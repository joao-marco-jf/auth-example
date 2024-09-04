import { bcrypt } from "@/lib/bcrypt";
import { SignupFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const validatedFields = SignupFormSchema.safeParse({
            firstname: formData.get('firstname') as string,
            lastname: formData.get('lastname') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        });

        if(!validatedFields.success) {
            return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
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
            return NextResponse.json({ message: 'An error occurred while creating your account.' }, { status: 500 });
        }

        await createSession(user.id.toString());
        return NextResponse.json({ message: 'Successfully signed in' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}