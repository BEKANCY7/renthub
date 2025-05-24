import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcrypt";
import { db } from "@/lib/db";

// Input validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, {
    message: "Token is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, email, password } = resetPasswordSchema.parse(body);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token.",
        },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Verify the token against the database
    // 2. Check if the token has expired
    // 3. Update the password and delete the token

    // For this demonstration, we'll simulate a successful password reset
    console.log(`Reset password for ${email} with token: ${token}`);

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update the user's password
    // In a real app, this would include token validation
    // await db.user.update({
    //   where: { id: user.id },
    //   data: { hashedPassword },
    // });

    // Simulate successful password reset
    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully.",
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

    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
