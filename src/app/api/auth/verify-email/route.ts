import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});

// POST /api/auth/verify-email - Request email verification
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = emailSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token valid for 24 hours

    // Store the token
    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token,
        expires,
      },
    });

    // In a real app, send the verification email with the token
    // For demo purposes, we'll just return the token
    const verificationLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/verify?token=${token}`;

    // In production, you would use an email service like SendGrid, Mailgun, etc.
    console.log(`Verification link: ${verificationLink}`);

    return NextResponse.json({
      success: true,
      message: "Verification email sent",
      // Only include the token in development
      ...(process.env.NODE_ENV === "development" && {
        token,
        verificationLink,
      }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}

// GET /api/auth/verify-email - Verify email with token
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { id: verificationToken.identifier },
      data: {
        emailVerified: new Date(),
        isVerified: true,
      },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
