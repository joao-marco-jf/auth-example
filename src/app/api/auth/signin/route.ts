import { NextRequest, NextResponse } from "next/server";

import { SigninFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { bcrypt } from "@/lib/bcrypt";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const validatedFields = SigninFormSchema.safeParse({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        });

        if(!validatedFields.success) {
            return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
        }

        const { email, password } = validatedFields.data;

        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if(!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        await createSession(user.id.toString())
        return NextResponse.json({ message: 'Successfully signed in' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}