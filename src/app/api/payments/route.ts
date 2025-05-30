import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/payments - Get all payments for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view payments" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const bookingId = searchParams.get("bookingId");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build the where clause based on the query parameters
    const where: any = {
      OR: [{ payerId: session.user.id }, { receiverId: session.user.id }],
    };

    if (status) {
      where.status = status;
    }

    if (bookingId) {
      where.bookingId = bookingId;
    }

    // Get payments
    const payments = await prisma.payment.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
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
      },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to make a payment" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { bookingId, amount, paymentMethod, referenceCode } = data;

    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, amount, paymentMethod" },
        { status: 400 }
      );
    }

    // Validate the booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.renterId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only make payments for your own bookings" },
        { status: 403 }
      );
    }

    // Create the payment with PENDING status
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        status: "PENDING", // Start as pending
        paymentMethod,
        referenceCode,
        bookingId,
        payerId: session.user.id,
        receiverId: booking.ownerId,
        metadata: JSON.stringify({
          initiatedAt: new Date().toISOString(),
          userAgent: request.headers.get("user-agent"),
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        }),
      },
      include: {
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      payment,
      message:
        "Payment initiated successfully. Please complete the payment with your chosen method.",
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
