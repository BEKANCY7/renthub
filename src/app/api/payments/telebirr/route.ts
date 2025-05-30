import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/payments/telebirr - Initiate a TeleBirr payment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to initiate a payment" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { paymentId, phoneNumber } = data;

    if (!paymentId || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, phoneNumber" },
        { status: 400 }
      );
    }

    // Validate phone number format (Ethiopian phone number)
    if (!isValidEthiopianPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Please use a valid Ethiopian phone number.",
        },
        { status: 400 }
      );
    }

    // Find the payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Ensure the payment belongs to the user
    if (payment.payerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only initiate payments for your own bookings" },
        { status: 403 }
      );
    }

    // In a real implementation, you would integrate with TeleBirr API here
    // For demo purposes, we'll simulate the TeleBirr API request

    // Generate a simulated transaction ID
    const transactionId = generateTransactionId();

    // Update the payment with the transaction ID and phone number
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        transactionId,
        metadata: JSON.stringify({
          phoneNumber,
          telebirrInitiated: true,
          initiatedAt: new Date().toISOString(),
        }),
      },
    });

    // Simulate TeleBirr response
    return NextResponse.json({
      success: true,
      telebirr: {
        transactionId,
        amount: payment.amount,
        phoneNumber,
        recipientName: "RentHub Payments",
        paymentCode: generatePaymentCode(),
        expiresIn: 600, // 10 minutes in seconds
      },
      message:
        "TeleBirr payment initiated. Please complete the payment on your TeleBirr mobile app.",
    });
  } catch (error) {
    console.error("Error initiating TeleBirr payment:", error);
    return NextResponse.json(
      { error: "Failed to initiate TeleBirr payment" },
      { status: 500 }
    );
  }
}

// Helper function to validate Ethiopian phone number
function isValidEthiopianPhoneNumber(phoneNumber: string): boolean {
  // Ethiopian phone numbers: +251 followed by 9 digits, or 09 followed by 8 digits
  const pattern1 = /^\+2519\d{8}$/; // +251911234567 format
  const pattern2 = /^09\d{8}$/; // 0911234567 format

  return pattern1.test(phoneNumber) || pattern2.test(phoneNumber);
}

// Helper function to generate a random transaction ID
function generateTransactionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `TB${timestamp}${random}`;
}

// Helper function to generate a payment code for TeleBirr
function generatePaymentCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
