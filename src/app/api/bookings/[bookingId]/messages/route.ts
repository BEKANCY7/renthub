import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/bookings/[bookingId]/messages
export async function GET(
    request: Request,
    { params }: { params: { bookingId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.bookingId },
            include: {
                renter: true,
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

        // Check if user is either the renter or owner
        if (
            booking.renterId !== session.user.id &&
            booking.listing.ownerId !== session.user.id
        ) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const messages = await prisma.message.findMany({
            where: { bookingId: params.bookingId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("[MESSAGES_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// POST /api/bookings/[bookingId]/messages
export async function POST(
    request: Request,
    { params }: { params: { bookingId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { content } = body;

        if (!content) {
            return new NextResponse("Content is required", { status: 400 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.bookingId },
            include: {
                renter: true,
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

        // Check if user is either the renter or owner
        if (
            booking.renterId !== session.user.id &&
            booking.listing.ownerId !== session.user.id
        ) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                bookingId: params.bookingId,
                senderId: session.user.id,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("[MESSAGES_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
} 