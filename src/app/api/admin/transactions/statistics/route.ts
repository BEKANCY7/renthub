import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse filter parameters
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const paymentMethod = searchParams.get("paymentMethod");
    const status = searchParams.get("status");

    // Parse dates or use defaults (last 30 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date();

    let startDate: Date;
    if (startDateParam) {
      startDate = new Date(startDateParam);
    } else {
      // Default to 30 days ago if no start date provided
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    // Calculate previous period (same duration before startDate)
    const periodDuration = endDate.getTime() - startDate.getTime();
    const prevPeriodEndDate = new Date(startDate);
    const prevPeriodStartDate = new Date(
      prevPeriodEndDate.getTime() - periodDuration
    );

    // Base query filters for current period
    const currentPeriodFilters: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Base query filters for previous period
    const prevPeriodFilters: any = {
      createdAt: {
        gte: prevPeriodStartDate,
        lte: prevPeriodEndDate,
      },
    };

    // Add additional filters if provided
    if (paymentMethod) {
      currentPeriodFilters.paymentMethod = paymentMethod;
      prevPeriodFilters.paymentMethod = paymentMethod;
    }

    if (status) {
      currentPeriodFilters.status = status;
      prevPeriodFilters.status = status;
    }

    // Get current period transactions
    const currentPeriodTransactions = await db.payment.findMany({
      where: currentPeriodFilters,
    });

    // Get previous period transactions
    const prevPeriodTransactions = await db.payment.findMany({
      where: prevPeriodFilters,
    });

    // Calculate current period statistics
    const totalTransactions = currentPeriodTransactions.length;
    const totalAmount = currentPeriodTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const successfulTransactions = currentPeriodTransactions.filter(
      (t) => t.status === "COMPLETED" || t.status === "VERIFIED"
    ).length;

    const successRate =
      totalTransactions > 0
        ? (successfulTransactions / totalTransactions) * 100
        : 0;

    const averageAmount =
      totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    // Calculate previous period statistics
    const prevTotalTransactions = prevPeriodTransactions.length;
    const prevTotalAmount = prevPeriodTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const prevSuccessfulTransactions = prevPeriodTransactions.filter(
      (t) => t.status === "COMPLETED" || t.status === "VERIFIED"
    ).length;

    const prevSuccessRate =
      prevTotalTransactions > 0
        ? (prevSuccessfulTransactions / prevTotalTransactions) * 100
        : 0;

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const transactionsChange = calculatePercentageChange(
      totalTransactions,
      prevTotalTransactions
    );
    const amountChange = calculatePercentageChange(
      totalAmount,
      prevTotalAmount
    );
    const successRateChange = calculatePercentageChange(
      successRate,
      prevSuccessRate
    );

    return NextResponse.json({
      totalTransactions,
      totalAmount,
      successRate,
      averageAmount,
      changeFromLastPeriod: {
        transactions: transactionsChange,
        amount: amountChange,
        successRate: successRateChange,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction statistics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
