import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get active users
    const activeUsers = await prisma.user.count({
      where: {
        status: "ACTIVE",
      },
    });

    // Get suspended users
    const suspendedUsers = await prisma.user.count({
      where: {
        status: "SUSPENDED",
      },
    });

    // Get admin users
    const adminUsers = await prisma.user.count({
      where: {
        isAdmin: true,
      },
    });

    // Get owners
    const owners = await prisma.user.count({
      where: {
        role: "OWNER",
      },
    });

    // Get renters
    const renters = await prisma.user.count({
      where: {
        role: "RENTER",
      },
    });

    // Get recent signups (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      activeUsers,
      suspendedUsers,
      adminUsers,
      owners,
      renters,
      recentSignups,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}
