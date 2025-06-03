import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/auth/verify-documents - Upload verification documents
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to upload verification documents" },
        { status: 401 }
      );
    }

    // In a real app, you would handle file uploads here
    // For demo purposes, we'll simulate document upload with a JSON payload
    const body = await req.json();
    const { documentUrls } = body;

    if (
      !documentUrls ||
      !Array.isArray(documentUrls) ||
      documentUrls.length === 0
    ) {
      return NextResponse.json(
        { error: "Document URLs are required" },
        { status: 400 }
      );
    }

    // Update user's document verification status
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        verificationDocuments: JSON.stringify(documentUrls),
        // Documents need admin review, so don't set isVerified to true yet
      },
    });

    // Create a notification for admins to review the documents
    await prisma.notification.create({
      data: {
        title: "Document Verification Request",
        message: `User ${session.user.email} has uploaded verification documents for review.`,
        type: "INFO",
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Documents uploaded successfully and pending review",
    });
  } catch (error) {
    console.error("Document verification error:", error);
    return NextResponse.json(
      { error: "Failed to upload verification documents" },
      { status: 500 }
    );
  }
}

// For admin use only - approve or reject document verification
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You must be an admin to approve verification documents" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, approved, rejectionReason } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (approved) {
      // Approve verification
      await prisma.user.update({
        where: { id: userId },
        data: {
          isVerified: true,
        },
      });

      // Create notification for the user
      await prisma.notification.create({
        data: {
          title: "Verification Approved",
          message: "Your verification documents have been approved.",
          type: "SUCCESS",
          userId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "User verification approved",
      });
    } else {
      // Reject verification
      await prisma.user.update({
        where: { id: userId },
        data: {
          verificationDocuments: null, // Clear documents to allow resubmission
        },
      });

      // Create notification for the user
      await prisma.notification.create({
        data: {
          title: "Verification Rejected",
          message:
            rejectionReason ||
            "Your verification documents were rejected. Please upload new documents.",
          type: "WARNING",
          userId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "User verification rejected",
      });
    }
  } catch (error) {
    console.error("Document verification approval error:", error);
    return NextResponse.json(
      { error: "Failed to process verification documents" },
      { status: 500 }
    );
  }
}
