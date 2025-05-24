import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Input validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      // For security reasons, always return a success message even if user doesn't exist
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, we've sent a password reset link.",
      });
    }

    // In a real application, you would:
    // 1. Generate a reset token and save it to the database
    // 2. Set an expiration time for the token
    // 3. Send an email with the reset link

    // For this demonstration, we'll just simulate the process
    // Generate a reset token (in a real app, use a secure method)
    const resetToken = Math.random().toString(36).substring(2, 15);

    // Save the token to the database (in a real app)
    // await db.passwordReset.create({
    //   data: {
    //     userId: user.id,
    //     token: resetToken,
    //     expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    //   },
    // });

    // For demo purposes, log the token
    console.log(`Reset token for ${email}: ${resetToken}`);

    // Return success message
    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, we've sent a password reset link.",
      // Include the token in development only
      ...(process.env.NODE_ENV === "development" && {
        dev: {
          resetToken,
          resetUrl: `${
            process.env.NEXTAUTH_URL
          }/reset-password?token=${resetToken}&email=${encodeURIComponent(
            email
          )}`,
        },
      }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
