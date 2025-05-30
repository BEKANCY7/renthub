"use client";

import { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Download, Filter, RefreshCcw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState("last30Days");
  const [activeTab, setActiveTab] = useState("overview");

  // Revenue Data
  const revenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          5000, 7500, 8000, 9800, 7600, 10200, 11500, 13000, 12500, 14800,
          16500, 18000,
        ],
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Listings by Category Data
  const listingsByCategoryData = {
    labels: ["Apartment", "House", "Villa", "Condo", "Townhouse", "Studio"],
    datasets: [
      {
        data: [45, 25, 10, 15, 8, 7],
        backgroundColor: [
          "rgba(52, 152, 219, 0.7)",
          "rgba(46, 204, 113, 0.7)",
          "rgba(155, 89, 182, 0.7)",
          "rgba(241, 196, 15, 0.7)",
          "rgba(230, 126, 34, 0.7)",
          "rgba(231, 76, 60, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // User Growth Data
  const userGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: [120, 150, 180, 250, 300, 340, 390, 450, 520, 580, 650, 720],
        fill: false,
        borderColor: "rgba(46, 204, 113, 1)",
        tension: 0.3,
      },
      {
        label: "Active Users",
        data: [100, 120, 140, 180, 230, 260, 310, 380, 440, 520, 600, 680],
        fill: false,
        borderColor: "rgba(52, 152, 219, 1)",
        tension: 0.3,
      },
    ],
  };

  // Booking Trends Data
  const bookingTrendsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Bookings",
        data: [85, 95, 130, 150, 180, 210, 250, 290, 270, 240, 220, 260],
        backgroundColor: "rgba(155, 89, 182, 0.5)",
        borderColor: "rgba(155, 89, 182, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Payment Methods Data
  const paymentMethodsData = {
    labels: ["Credit Card", "PayPal", "Bank Transfer", "Mobile Money", "Cash"],
    datasets: [
      {
        data: [55, 20, 15, 8, 2],
        backgroundColor: [
          "rgba(52, 152, 219, 0.7)",
          "rgba(46, 204, 113, 0.7)",
          "rgba(155, 89, 182, 0.7)",
          "rgba(241, 196, 15, 0.7)",
          "rgba(231, 76, 60, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // City Distribution Data
  const cityDistributionData = {
    labels: [
      "Addis Ababa",
      "Hawassa",
      "Bahir Dar",
      "Adama",
      "Gondar",
      "Mekelle",
      "Other",
    ],
    datasets: [
      {
        data: [45, 15, 10, 8, 7, 5, 10],
        backgroundColor: [
          "rgba(52, 152, 219, 0.7)",
          "rgba(46, 204, 113, 0.7)",
          "rgba(155, 89, 182, 0.7)",
          "rgba(241, 196, 15, 0.7)",
          "rgba(230, 126, 34, 0.7)",
          "rgba(231, 76, 60, 0.7)",
          "rgba(149, 165, 166, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleExportReport = () => {
    // Logic to export reports as CSV or PDF
    alert("Export functionality would be implemented here");
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Insights and data about your platform's performance
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7Days">Last 7 Days</SelectItem>
              <SelectItem value="last30Days">Last 30 Days</SelectItem>
              <SelectItem value="last90Days">Last 90 Days</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB 145,000</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="success" className="mr-1">
                +15%
              </Badge>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="success" className="mr-1">
                +8%
              </Badge>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,841</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="success" className="mr-1">
                +12%
              </Badge>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">845</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="success" className="mr-1">
                +20%
              </Badge>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={revenueData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Listings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div style={{ maxWidth: "250px", maxHeight: "250px" }}>
                    <Pie data={listingsByCategoryData} options={chartOptions} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line data={userGrowthData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={bookingTrendsData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Listings by City</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div style={{ maxWidth: "250px", maxHeight: "250px" }}>
                    <Pie data={cityDistributionData} options={chartOptions} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line data={userGrowthData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div style={{ maxWidth: "250px", maxHeight: "250px" }}>
                    <Pie data={paymentMethodsData} options={chartOptions} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="bg-primary/10 p-2 rounded-full">
                <RefreshCcw className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">System Generated Report</div>
                <p className="text-sm text-muted-foreground">
                  Monthly performance report has been generated
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="bg-primary/10 p-2 rounded-full">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Revenue Analysis</div>
                <p className="text-sm text-muted-foreground">
                  Revenue increased by 15% compared to last month
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  5 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="bg-primary/10 p-2 rounded-full">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Report Downloaded</div>
                <p className="text-sm text-muted-foreground">
                  Admin user downloaded the Q3 financial report
                </p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
