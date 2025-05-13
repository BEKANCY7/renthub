import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["RENTER", "OWNER"]),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role } = userSchema.parse(body);

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: "User with this email already exists",
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create user
        const user = await db.user.create({
            data: {
                name,
                email,
                hashedPassword,
                role,
            },
        });

        // Return user without password
        const { hashedPassword: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                user: userWithoutPassword,
                message: "User created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid request data",
                    errors: error.errors,
                },
                { status: 422 }
            );
        }

        console.error("Registration error:", error);

        return NextResponse.json(
            {
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
} 