import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/listings - Get all listings or user's listings
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const onlyMine = searchParams.get("onlyMine") === "true";

        const whereClause = onlyMine
            ? { ownerId: session.user.id }
            : {};

        const listings = await db.listing.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            include: {
                bookings: {
                    where: { status: "PENDING" }
                }
            }
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
    }
}

// POST /api/listings - Create a new listing
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is an owner or admin
        const isOwner = session.user.role === "OWNER" || session.user.role === "ADMIN";
        if (!isOwner) {
            return NextResponse.json({ error: "Only owners can create listings" }, { status: 403 });
        }

        const data = await req.json();

        // Create the listing in the database
        const listing = await db.listing.create({
            data: {
                ...data,
                ownerId: session.user.id,
            }
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
    }
} 