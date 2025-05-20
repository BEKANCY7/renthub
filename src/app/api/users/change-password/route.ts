import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { hash, compare } from "bcrypt";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get the user with their current password
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                hashedPassword: true,
            },
        });

        if (!user || !user.hashedPassword) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Verify the current password
        const isPasswordValid = await compare(
            currentPassword,
            user.hashedPassword
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await hash(newPassword, 10);

        // Update the user's password
        await db.user.update({
            where: { id: user.id },
            data: {
                hashedPassword,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("[CHANGE_PASSWORD_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 