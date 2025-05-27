import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/users - Get all users with filters
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build the where clause based on filters
    const whereClause: any = {};

    // Add role filter if provided
    if (role && role !== "ALL") {
      whereClause.role = role;
    }

    // Add status filter if provided
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      whereClause.createdAt = {};

      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }

      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch users with related data
    const users = await db.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        phoneNumber: true,
        phoneVerified: true,
        suspendedUntil: true,
        suspensionReason: true,
        _count: {
          select: {
            listings: true,
            bookings: true,
            payments: true,
            receivedPayments: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
