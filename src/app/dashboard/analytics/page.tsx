import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// Define types for our SQL query results
type MonthlyBookingData = {
  month: number;
  count: number;
};

type MonthlyEarningData = {
  month: number;
  total: number;
};

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Check if user is an owner or admin
    const isOwner = session.user.role === "OWNER" || session.user.role === "ADMIN";
    if (!isOwner) {
        redirect("/dashboard");
    }

    // Get analytics data
    const totalListings = await db.listing.count({
        where: { ownerId: session.user.id }
    });

    const activeListings = await db.listing.count({
        where: {
            ownerId: session.user.id,
            status: "ACTIVE"
        }
    });

    const totalBookings = await db.booking.count({
        where: { ownerId: session.user.id }
    });

    const pendingBookings = await db.booking.count({
        where: {
            ownerId: session.user.id,
            status: "PENDING"
        }
    });

    const completedBookings = await db.booking.count({
        where: {
            ownerId: session.user.id,
            status: "COMPLETED"
        }
    });

    const cancelledBookings = await db.booking.count({
        where: {
            ownerId: session.user.id,
            status: "CANCELLED"
        }
    });

    // Calculate totals
    const totalEarnings = await db.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            receiverId: session.user.id,
            status: "COMPLETED"
        }
    });

    // Monthly data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Get monthly bookings data using Prisma's groupBy instead of raw SQL
    const monthlyBookings: MonthlyBookingData[] = [];
    
    // Fetch bookings for the last 6 months
    const bookings = await db.booking.findMany({
        where: {
            ownerId: session.user.id,
            createdAt: {
                gte: sixMonthsAgo
            }
        },
        select: {
            createdAt: true
        }
    });
    
    // Process the bookings to get monthly counts
    const monthCounts = new Map<number, number>();
    
    bookings.forEach(booking => {
        const month = booking.createdAt.getMonth() + 1; // JavaScript months are 0-indexed
        monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
    });
    
    // Convert to our expected format
    for (const [month, count] of monthCounts.entries()) {
        monthlyBookings.push({ month, count });
    }
    
    // Sort by month
    monthlyBookings.sort((a, b) => a.month - b.month);

    // Get monthly earnings data using Prisma's findMany and process in JavaScript
    const monthlyEarnings: MonthlyEarningData[] = [];
    
    // Fetch payments for the last 6 months
    const payments = await db.payment.findMany({
        where: {
            receiverId: session.user.id,
            status: "COMPLETED",
            createdAt: {
                gte: sixMonthsAgo
            }
        },
        select: {
            createdAt: true,
            amount: true
        }
    });
    
    // Process the payments to get monthly totals
    const monthTotals = new Map<number, number>();
    
    payments.forEach(payment => {
        const month = payment.createdAt.getMonth() + 1; // JavaScript months are 0-indexed
        monthTotals.set(month, (monthTotals.get(month) || 0) + payment.amount);
    });
    
    // Convert to our expected format
    for (const [month, total] of monthTotals.entries()) {
        monthlyEarnings.push({ month, total });
    }
    
    // Sort by month
    monthlyEarnings.sort((a, b) => a.month - b.month);

    // Top performing listings
    const topListings = await db.listing.findMany({
        where: { ownerId: session.user.id },
        include: {
            _count: {
                select: { bookings: true }
            }
        },
        orderBy: {
            bookings: {
                _count: 'desc'
            }
        },
        take: 5
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ETB {totalEarnings._sum.amount?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime earnings from completed bookings
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedBookings} completed, {pendingBookings} pending
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeListings}</div>
                        <p className="text-xs text-muted-foreground">
                            Out of {totalListings} total listings
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Booking Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalListings > 0
                                ? ((totalBookings / totalListings) * 100).toFixed(1) + '%'
                                : '0%'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Average bookings per listing
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="bookings" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="bookings">Booking Analytics</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings Analytics</TabsTrigger>
                    <TabsTrigger value="listings">Listing Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="bookings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Overview</CardTitle>
                            <CardDescription>
                                Detailed breakdown of your booking statistics
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Completed Bookings</p>
                                    <p className="text-2xl font-bold">{completedBookings}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {totalBookings > 0
                                            ? ((completedBookings / totalBookings) * 100).toFixed(1) + '%'
                                            : '0%'} of total
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Pending Bookings</p>
                                    <p className="text-2xl font-bold">{pendingBookings}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {totalBookings > 0
                                            ? ((pendingBookings / totalBookings) * 100).toFixed(1) + '%'
                                            : '0%'} of total
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Cancelled Bookings</p>
                                    <p className="text-2xl font-bold">{cancelledBookings}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {totalBookings > 0
                                            ? ((cancelledBookings / totalBookings) * 100).toFixed(1) + '%'
                                            : '0%'} of total
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Monthly Booking Trend</p>
                                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                                    <div className="w-full h-full p-4 flex items-end justify-between">
                                        {/* Display actual booking data from our query */}
                                        {Array.from({ length: 6 }).map((_, i) => {
                                            // Find data for this month (i+1)
                                            const monthData = monthlyBookings.find(
                                                (data) => data.month === i + 1
                                            );
                                            const count = monthData ? monthData.count : 0;
                                            // Calculate height based on count (max 150px)
                                            const maxCount = Math.max(...monthlyBookings.map(d => d.count || 0), 1);
                                            const height = count ? Math.max((count / maxCount) * 150, 20) : 20;
                                            
                                            return (
                                                <div key={i} className="flex flex-col items-center">
                                                    <div
                                                        className="bg-primary w-10 rounded-t-md"
                                                        style={{ height: `${height}px` }}
                                                    ></div>
                                                    <p className="text-xs mt-1">Month {i + 1}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="earnings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Earnings Overview</CardTitle>
                            <CardDescription>
                                Detailed breakdown of your revenue in ETB
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-2">Monthly Revenue (ETB)</p>
                                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                                    <div className="w-full h-full p-4 flex items-end justify-between">
                                        {/* Display actual earnings data from our query */}
                                        {Array.from({ length: 6 }).map((_, i) => {
                                            // Find data for this month (i+1)
                                            const monthData = monthlyEarnings.find(
                                                (data) => data.month === i + 1
                                            );
                                            const total = monthData ? monthData.total : 0;
                                            // Calculate height based on total (max 150px)
                                            const maxTotal = Math.max(...monthlyEarnings.map(d => d.total || 0), 1);
                                            const height = total ? Math.max((total / maxTotal) * 150, 20) : 20;
                                            
                                            return (
                                                <div key={i} className="flex flex-col items-center">
                                                    <div
                                                        className="bg-green-500 w-10 rounded-t-md"
                                                        style={{ height: `${height}px` }}
                                                    ></div>
                                                    <p className="text-xs mt-1">Month {i + 1}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Avg. Booking Value</p>
                                    <p className="text-2xl font-bold">
                                        ETB {totalBookings > 0 && totalEarnings._sum.amount
                                            ? Math.round(totalEarnings._sum.amount / totalBookings).toLocaleString()
                                            : '0'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Per completed booking
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Monthly Average</p>
                                    <p className="text-2xl font-bold">
                                        ETB {totalEarnings._sum.amount
                                            ? Math.round(totalEarnings._sum.amount / 6).toLocaleString()
                                            : '0'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Based on last 6 months
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Revenue Per Listing</p>
                                    <p className="text-2xl font-bold">
                                        ETB {totalListings > 0 && totalEarnings._sum.amount
                                            ? Math.round(totalEarnings._sum.amount / totalListings).toLocaleString()
                                            : '0'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Average across all listings
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="listings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Listing Performance</CardTitle>
                            <CardDescription>
                                See which of your listings are performing best
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topListings.length > 0 ? (
                                    topListings.map((listing) => (
                                        <div key={listing.id} className="flex items-center space-x-4 border-b pb-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                                <Image
                                                    src={listing.imageUrls?.split(',')[0] || "/placeholder.jpg"}
                                                    alt={listing.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="font-medium">{listing.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {listing.city || "Addis Ababa"}, {listing.country || "Ethiopia"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">ETB {listing.price.toLocaleString()}/day</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {listing._count.bookings} bookings
                                                </p>

                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No listing data available yet</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 