import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/listings - Get all property listings with filters
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build the where clause based on filters
    const whereClause: any = {
      // Exclude vehicle listings (CAR, BOAT)
      category: {
        notIn: ["CAR", "BOAT", "OTHER"],
      },
    };

    // Add type filter if provided
    if (type && type !== "ALL") {
      whereClause.category = type;
    }

    // Add status filter if provided
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch listings with owner information
    const listings = await db.listing.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching admin listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
