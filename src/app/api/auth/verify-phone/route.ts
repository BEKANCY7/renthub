import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const phoneSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
});

const verifySchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  code: z.string().length(6),
});

// Store verification codes in memory (in production, use Redis or similar)
const verificationCodes: Record<string, { code: string; expires: Date }> = {};

// Function to generate a random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/verify-phone - Request phone verification
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to verify your phone number" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { phoneNumber } = phoneSchema.parse(body);

    // Generate a verification code
    const code = generateVerificationCode();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // Code valid for 10 minutes

    // Store the code (in memory for demo, use Redis in production)
    verificationCodes[`${session.user.id}-${phoneNumber}`] = { code, expires };

    // In a real app, send the verification code via SMS
    // For demo purposes, we'll just return the code
    console.log(`Verification code for ${phoneNumber}: ${code}`);

    // Update user's phone number in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phoneNumber },
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      // Only include the code in development
      ...(process.env.NODE_ENV === "development" && { code }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    console.error("Phone verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}

// PUT /api/auth/verify-phone - Verify phone with code
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to verify your phone number" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { phoneNumber, code } = verifySchema.parse(body);

    // Check if verification code exists and is valid
    const key = `${session.user.id}-${phoneNumber}`;
    const verification = verificationCodes[key];

    if (!verification) {
      return NextResponse.json(
        { error: "No verification code found for this phone number" },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (new Date() > verification.expires) {
      // Delete expired code
      delete verificationCodes[key];

      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Check if code matches
    if (verification.code !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Update user's phone verification status
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phoneNumber,
        phoneVerified: true,
      },
    });

    // Delete the used code
    delete verificationCodes[key];

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    console.error("Phone verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify phone number" },
      { status: 500 }
    );
  }
}
