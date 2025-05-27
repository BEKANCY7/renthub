import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ITEMS_PER_PAGE = 10;

// GET /api/admin/transactions - Get all transactions with filters
export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Parse filter parameters
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const search = searchParams.get("search");

    // Build where clause based on filters
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (paymentMethod && paymentMethod !== "all") {
      where.paymentMethod = paymentMethod;
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

    // Search filter - search by ID, user email/name, or listing title
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        { listing: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get total count for pagination
    const totalTransactions = await prisma.payment.count({ where });
    const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

    // Fetch transactions with pagination
    const transactions = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      transactions,
      totalTransactions,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
