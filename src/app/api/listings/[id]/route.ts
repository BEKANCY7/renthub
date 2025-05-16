import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/listings/[id] - Get a specific listing
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const listing = await db.listing.findUnique({
            where: { id },
            include: {
                bookings: {
                    where: { status: "PENDING" }
                }
            }
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Error fetching listing:", error);
        return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
    }
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const data = await req.json();

        // Verify the listing belongs to the user
        const existingListing = await db.listing.findUnique({
            where: { id }
        });

        if (!existingListing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        if (existingListing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "You do not have permission to update this listing" }, { status: 403 });
        }

        // Update the listing
        const updatedListing = await db.listing.update({
            where: { id },
            data
        });

        return NextResponse.json(updatedListing);
    } catch (error) {
        console.error("Error updating listing:", error);
        return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
    }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Verify the listing belongs to the user
        const existingListing = await db.listing.findUnique({
            where: { id }
        });

        if (!existingListing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        if (existingListing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "You do not have permission to delete this listing" }, { status: 403 });
        }

        // Delete the listing
        await db.listing.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting listing:", error);
        return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
    }
} 