import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// GET /api/admin/transactions/[id] - Get a specific transaction
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactionId = params.id;

    const transaction = await db.payment.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            propertyType: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        // Include admin notes if any
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PATCH /api/admin/transactions/[id] - Update a transaction status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactionId = params.id;
    const body = await request.json();
    const { action, reason, note } = body;

    // Get the transaction first to check if it exists and get related data
    const transaction = await db.payment.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    // Define actions that can be performed
    const actions = {
      verify: async () => {
        // Update transaction status to VERIFIED
        const updated = await db.payment.update({
          where: { id: transactionId },
          data: {
            status: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: session.user.id,
          },
        });

        // Add admin note if provided
        if (note) {
          await db.paymentNote.create({
            data: {
              content: note,
              paymentId: transactionId,
              adminId: session.user.id,
            },
          });
        }

        // Send notification email to user
        await sendEmail({
          to: transaction.user.email,
          subject: "Your Payment Has Been Verified",
          text: `Dear ${transaction.user.name},\n\nYour payment of ETB ${transaction.amount} has been verified by our team. Thank you for using our platform.\n\nTransaction ID: ${transaction.id}\n\nBest regards,\nRentHub Team`,
        });

        return updated;
      },

      flag: async () => {
        if (!reason) {
          return new NextResponse(
            "Reason is required for flagging a transaction",
            { status: 400 }
          );
        }

        // Update transaction status to FLAGGED
        const updated = await db.payment.update({
          where: { id: transactionId },
          data: {
            status: "FLAGGED",
            flaggedAt: new Date(),
            flaggedBy: session.user.id,
          },
        });

        // Add admin note with the reason
        await db.paymentNote.create({
          data: {
            content: `FLAGGED: ${reason}${
              note ? `\n\nAdditional notes: ${note}` : ""
            }`,
            paymentId: transactionId,
            adminId: session.user.id,
          },
        });

        // Send notification email to user
        await sendEmail({
          to: transaction.user.email,
          subject: "Your Payment Has Been Flagged for Review",
          text: `Dear ${transaction.user.name},\n\nYour payment of ETB ${transaction.amount} has been flagged for review by our team. We'll contact you shortly if we need additional information.\n\nTransaction ID: ${transaction.id}\n\nBest regards,\nRentHub Team`,
        });

        return updated;
      },

      refund: async () => {
        if (!reason) {
          return new NextResponse(
            "Reason is required for refunding a transaction",
            { status: 400 }
          );
        }

        // Update transaction status to REFUNDED
        const updated = await db.payment.update({
          where: { id: transactionId },
          data: {
            status: "REFUNDED",
            refundedAt: new Date(),
            refundedBy: session.user.id,
          },
        });

        // Add admin note with the reason
        await db.paymentNote.create({
          data: {
            content: `REFUNDED: ${reason}${
              note ? `\n\nAdditional notes: ${note}` : ""
            }`,
            paymentId: transactionId,
            adminId: session.user.id,
          },
        });

        // Send notification email to user
        await sendEmail({
          to: transaction.user.email,
          subject: "Your Payment Has Been Refunded",
          text: `Dear ${transaction.user.name},\n\nYour payment of ETB ${transaction.amount} has been refunded. Reason: ${reason}\n\nTransaction ID: ${transaction.id}\n\nBest regards,\nRentHub Team`,
        });

        return updated;
      },

      addNote: async () => {
        if (!note) {
          return new NextResponse("Note content is required", { status: 400 });
        }

        // Add admin note
        const newNote = await db.paymentNote.create({
          data: {
            content: note,
            paymentId: transactionId,
            adminId: session.user.id,
          },
        });

        return newNote;
      },
    };

    // Check if the requested action is valid
    if (!action || !actions[action as keyof typeof actions]) {
      return new NextResponse("Invalid action", { status: 400 });
    }

    // Execute the action
    const result = await actions[action as keyof typeof actions]();

    // If the action returned an error response, return it
    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
