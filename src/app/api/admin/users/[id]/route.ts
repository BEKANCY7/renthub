import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// GET /api/admin/users/[id] - Get a specific user with detailed information
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch user with related data
    const user = await db.user.findUnique({
      where: { id },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            price: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        bookings: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
            status: true,
            listing: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        receivedPayments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            listings: true,
            bookings: true,
            payments: true,
            receivedPayments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total revenue (sum of received payments)
    const totalRevenue = await db.payment.aggregate({
      where: {
        receiverId: id,
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      ...user,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update a user's status or details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    // Validate user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users/[id]/reset-password - Send password reset email
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { action } = await req.json();

    // Validate user exists
    const user = await db.user.findUnique({
      where: { id },
      select: {
        email: true,
        name: true,
      },
    });

    if (!user || !user.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "reset-password") {
      // Generate reset token (in a real app, you'd store this and use it for verification)
      const resetToken = Math.random().toString(36).substring(2, 15);

      // Send password reset email
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        text: `Hello ${
          user.name || "there"
        },\n\nYou are receiving this because an administrator has requested a password reset for your account.\n\nPlease click on the following link to reset your password:\n\nhttps://yourdomain.com/reset-password?token=${resetToken}\n\nIf you did not request this, please ignore this email.\n`,
      });

      return NextResponse.json({ success: true });
    } else if (action === "notify") {
      const { title, message } = await req.json();

      // Create notification
      await db.notification.create({
        data: {
          title,
          message,
          userId: id,
          type: "ALERT",
        },
      });

      // Send email notification
      await sendEmail({
        to: user.email,
        subject: title,
        text: `Hello ${
          user.name || "there"
        },\n\n${message}\n\nThis is an administrative notification from RentHub.\n`,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing action:", error);
    return NextResponse.json(
      { error: "Failed to process action" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete a user (soft delete by setting status to DELETED)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Validate user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Soft delete the user
    const deletedUser = await db.user.update({
      where: { id },
      data: {
        status: "DELETED",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
