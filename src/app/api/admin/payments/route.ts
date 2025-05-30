import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/payments - Get all payments with filters (admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You must be an admin to access this resource" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Parse filter parameters
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");
    const userId = searchParams.get("userId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const search = searchParams.get("search");
    const bookingId = searchParams.get("bookingId");

    // Build where clause based on filters
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (paymentMethod && paymentMethod !== "all") {
      where.paymentMethod = paymentMethod;
    }

    if (userId) {
      where.OR = [{ payerId: userId }, { receiverId: userId }];
    }

    if (bookingId) {
      where.bookingId = bookingId;
    }

    // Date filters
    if (startDateParam || endDateParam) {
      where.createdAt = {};

      if (startDateParam) {
        where.createdAt.gte = new Date(startDateParam);
      }

      if (endDateParam) {
        where.createdAt.lte = new Date(endDateParam);
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { referenceCode: { contains: search, mode: "insensitive" } },
        {
          payer: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          receiver: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          booking: {
            listing: { title: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    // Get total count for pagination
    const totalPayments = await prisma.payment.count({ where });
    const totalPages = Math.ceil(totalPayments / limit);

    // Fetch payments with pagination
    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                imageUrls: true,
              },
            },
          },
        },
        payer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            admin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Payment statistics
    const stats = await getPaymentStats();

    return NextResponse.json({
      payments,
      totalPayments,
      totalPages,
      currentPage: page,
      stats,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST /api/admin/payments - Update payment status (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You must be an admin to update payment status" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { paymentId, status, note } = data;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, status" },
        { status: 400 }
      );
    }

    // Check if payment exists
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      },
      include: {
        booking: true,
        payer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add note if provided
    if (note) {
      await prisma.paymentNote.create({
        data: {
          content: note,
          paymentId: paymentId,
          adminId: session.user.id,
        },
      });
    }

    // If payment is completed, update booking status to CONFIRMED
    if (
      status === "COMPLETED" &&
      payment.booking &&
      payment.booking.status === "PENDING"
    ) {
      await prisma.booking.update({
        where: { id: payment.booking.id },
        data: { status: "CONFIRMED" },
      });

      // Create notification for the renter
      await prisma.notification.create({
        data: {
          userId: payment.payerId,
          type: "PAYMENT_VERIFIED",
          content: `Your payment of ETB ${payment.amount} has been verified and confirmed.`,
          metadata: JSON.stringify({
            paymentId: payment.id,
            bookingId: payment.bookingId,
          }),
        },
      });

      // Create notification for the owner
      await prisma.notification.create({
        data: {
          userId: payment.receiverId,
          type: "PAYMENT_VERIFIED",
          content: `Payment of ETB ${
            payment.amount
          } for booking #${payment.bookingId.substring(
            0,
            8
          )} has been verified.`,
          metadata: JSON.stringify({
            paymentId: payment.id,
            bookingId: payment.bookingId,
          }),
        },
      });
    }

    // If payment is rejected, create notifications
    if (status === "REJECTED") {
      // Create notification for the renter
      await prisma.notification.create({
        data: {
          userId: payment.payerId,
          type: "PAYMENT_REJECTED",
          content: `Your payment of ETB ${payment.amount} has been rejected. Please check payment details.`,
          metadata: JSON.stringify({
            paymentId: payment.id,
            bookingId: payment.bookingId,
            note: note || "Payment verification failed",
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: `Payment status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

// Helper function to get payment statistics
async function getPaymentStats() {
  // Total payments by status
  const statusCounts = await prisma.payment.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
  });

  // Format status counts
  const stats = {
    totalAmount: 0,
    completed: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
    rejected: { count: 0, amount: 0 },
    byMethod: {} as any,
  };

  statusCounts.forEach((item) => {
    const status = item.status.toLowerCase();
    stats[status] = {
      count: item._count._all,
      amount: item._sum.amount || 0,
    };

    // Add to total
    if (status === "completed") {
      stats.totalAmount += item._sum.amount || 0;
    }
  });

  // Payments by method
  const methodCounts = await prisma.payment.groupBy({
    by: ["paymentMethod"],
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
    where: {
      status: "COMPLETED",
    },
  });

  methodCounts.forEach((item) => {
    const method = item.paymentMethod.toLowerCase();
    stats.byMethod[method] = {
      count: item._count._all,
      amount: item._sum.amount || 0,
    };
  });

  return stats;
}
