import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    const monthlyBookings = await db.booking.groupBy({
        by: ['month'],
        _count: {
            id: true
        },
        where: {
            ownerId: session.user.id,
            createdAt: {
                gte: sixMonthsAgo
            }
        }
    });

    const monthlyEarnings = await db.payment.groupBy({
        by: ['month'],
        _sum: {
            amount: true
        },
        where: {
            receiverId: session.user.id,
            status: "COMPLETED",
            createdAt: {
                gte: sixMonthsAgo
            }
        }
    });

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
                            ${totalEarnings._sum.amount?.toFixed(2) || '0.00'}
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
                                    <p className="text-sm text-gray-500">Booking chart would be displayed here</p>
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
                                Detailed breakdown of your revenue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-2">Monthly Revenue</p>
                                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                                    <p className="text-sm text-gray-500">Revenue chart would be displayed here</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Avg. Booking Value</p>
                                    <p className="text-2xl font-bold">
                                        ${totalBookings > 0 && totalEarnings._sum.amount
                                            ? (totalEarnings._sum.amount / totalBookings).toFixed(2)
                                            : '0.00'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Forecasted Earnings</p>
                                    <p className="text-2xl font-bold">
                                        ${totalEarnings._sum.amount
                                            ? (totalEarnings._sum.amount * 1.1).toFixed(2)
                                            : '0.00'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Based on current trends
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Last 30 Days</p>
                                    <p className="text-2xl font-bold">$0.00</p>
                                    <p className="text-xs text-muted-foreground">
                                        From recent bookings
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
                            {topListings.length === 0 ? (
                                <p className="text-sm text-gray-500">No listing data available</p>
                            ) : (
                                <div className="space-y-4">
                                    {topListings.map((listing) => (
                                        <div key={listing.id} className="flex items-center justify-between border-b pb-3">
                                            <div>
                                                <p className="font-medium">{listing.title}</p>
                                                <p className="text-sm text-gray-500">{listing.city}, {listing.state || listing.country}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{listing._count.bookings} bookings</p>
                                                <p className="text-sm text-gray-500">${listing.price}/night</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 