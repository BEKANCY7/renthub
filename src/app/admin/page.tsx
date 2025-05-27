"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building2,
  CreditCard,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardStats {
  users: {
    total: number;
    new: number;
    active: number;
    percentChange: number;
  };
  listings: {
    total: number;
    active: number;
    pending: number;
    percentChange: number;
  };
  transactions: {
    total: number;
    amount: number;
    completed: number;
    percentChange: number;
  };
  messages: {
    total: number;
    unread: number;
    percentChange: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    // In a real app, fetch stats from API
    // For demo, we'll use mock data
    const fetchStats = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      setStats({
        users: {
          total: 1245,
          new: 48,
          active: 892,
          percentChange: 12.5,
        },
        listings: {
          total: 342,
          active: 287,
          pending: 55,
          percentChange: 8.3,
        },
        transactions: {
          total: 876,
          amount: 1250000,
          completed: 742,
          percentChange: -3.2,
        },
        messages: {
          total: 2156,
          unread: 43,
          percentChange: 24.7,
        },
      });

      setLoading(false);
    };

    fetchStats();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your platform's performance
          </p>
        </div>
        <Tabs
          value={timeRange}
          onValueChange={setTimeRange}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.users.total}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {!loading && stats && (
                <>
                  {stats.users.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      stats.users.percentChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(stats.users.percentChange)}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.listings.active}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {!loading && stats && (
                <>
                  {stats.listings.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      stats.listings.percentChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(stats.listings.percentChange)}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaction Volume
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : formatCurrency(stats?.transactions.amount || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {!loading && stats && (
                <>
                  {stats.transactions.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      stats.transactions.percentChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(stats.transactions.percentChange)}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.messages.total}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {!loading && stats && (
                <>
                  {stats.messages.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      stats.messages.percentChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(stats.messages.percentChange)}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Chart visualization would go here in a real application.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View New Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Approve Listings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Process Transactions
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Respond to Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
