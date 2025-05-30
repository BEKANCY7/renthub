import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/payments/verify - Verify a payment by reference code
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to verify a payment" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { paymentId, referenceCode } = data;

    if (!paymentId || !referenceCode) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, referenceCode" },
        { status: 400 }
      );
    }

    // Find the payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
        payer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Ensure the payment belongs to the user
    if (
      payment.payerId !== session.user.id &&
      payment.receiverId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You don't have permission to verify this payment" },
        { status: 403 }
      );
    }

    // For demo purposes, we'll simulate a verification process
    // In a real implementation, this would call external payment APIs

    // Simulate verification with TeleBirr, CBE, etc.
    const isValid = await simulatePaymentVerification(
      payment.paymentMethod,
      referenceCode
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid reference code or payment could not be verified" },
        { status: 400 }
      );
    }

    // Update the payment status to COMPLETED
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        paymentDate: new Date(),
        referenceCode: referenceCode, // Update or set reference code
      },
      include: {
        booking: true,
      },
    });

    // If the booking is in PENDING status, update it to CONFIRMED
    if (payment.booking && payment.booking.status === "PENDING") {
      await prisma.booking.update({
        where: { id: payment.booking.id },
        data: { status: "CONFIRMED" },
      });
    }

    // Create a notification for the property owner
    await prisma.notification.create({
      data: {
        userId: payment.receiverId,
        type: "PAYMENT_RECEIVED",
        content: `Payment of ETB ${
          payment.amount
        } received for booking #${payment.bookingId.substring(0, 8)}`,
        metadata: JSON.stringify({
          paymentId: payment.id,
          bookingId: payment.bookingId,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}

// Simulate payment verification with external services
async function simulatePaymentVerification(
  paymentMethod: string,
  referenceCode: string
): Promise<boolean> {
  // In a real implementation, this would make API calls to payment providers

  // For demo purposes, we'll simulate different verification rules
  // based on payment method

  // Simulate a 1 second delay for API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  switch (paymentMethod) {
    case "TELEBIRR":
      // TeleBirr reference codes should be 10 digits
      return referenceCode.length === 10 && /^\d+$/.test(referenceCode);

    case "CBE":
      // CBE reference codes start with "TXN" followed by 8 digits
      return /^TXN\d{8}$/.test(referenceCode);

    case "CASH":
      // For cash, any reference is fine - admin will verify manually
      return true;

    case "CARD":
      // For cards, reference should be 16 digits (like a card number)
      return referenceCode.length >= 6 && /^\d+$/.test(referenceCode);

    default:
      return false;
  }
}
