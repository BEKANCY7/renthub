"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  PercentIcon,
} from "lucide-react";

interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageAmount: number;
  changeFromLastPeriod: {
    transactions: number;
    amount: number;
    successRate: number;
  };
}

interface TransactionStatisticsProps {
  startDate?: Date | null;
  endDate?: Date | null;
  paymentMethod?: string;
  status?: string;
}

export function TransactionStatistics({
  startDate,
  endDate,
  paymentMethod,
  status,
}: TransactionStatisticsProps) {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate.toISOString());
        if (endDate) params.append("endDate", endDate.toISOString());
        if (paymentMethod && paymentMethod !== "all")
          params.append("paymentMethod", paymentMethod);
        if (status && status !== "all") params.append("status", status);

        const response = await fetch(
          `/api/admin/transactions/statistics?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transaction statistics");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching transaction statistics:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [startDate, endDate, paymentMethod, status]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatChange = (value: number) => {
    return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.changeFromLastPeriod.transactions >= 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={
                stats.changeFromLastPeriod.transactions >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {formatChange(Math.abs(stats.changeFromLastPeriod.transactions))}
            </span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalAmount)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.changeFromLastPeriod.amount >= 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={
                stats.changeFromLastPeriod.amount >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {formatChange(Math.abs(stats.changeFromLastPeriod.amount))}
            </span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(stats.successRate)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.changeFromLastPeriod.successRate >= 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={
                stats.changeFromLastPeriod.successRate >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {formatChange(Math.abs(stats.changeFromLastPeriod.successRate))}
            </span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.averageAmount)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <DollarSignIcon className="h-3 w-3 mr-1" />
            <span>Per transaction</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
