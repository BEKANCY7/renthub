import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH /api/bookings/[bookingId]/status
export async function PATCH(
    request: Request,
    { params }: { params: { bookingId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return new NextResponse("Status is required", { status: 400 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.bookingId },
            include: {
                listing: {
                    include: {
                        owner: true,
                    },
                },
            },
        });

        if (!booking) {
            return new NextResponse("Booking not found", { status: 404 });
        }

        // Only the owner can confirm or cancel bookings
        if (booking.listing.ownerId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Validate status transitions
        const validTransitions: Record<string, string[]> = {
            PENDING: ["CONFIRMED", "CANCELLED"],
            CONFIRMED: ["COMPLETED", "CANCELLED"],
            COMPLETED: [],
            CANCELLED: [],
        };

        if (!validTransitions[booking.status].includes(status)) {
            return new NextResponse("Invalid status transition", { status: 400 });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: params.bookingId },
            data: { status },
            include: {
                renter: true,
                listing: {
                    include: {
                        owner: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error("[BOOKING_STATUS_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
} 