import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, DollarSign, MessageSquare, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import BookingActions from "@/components/bookings/BookingActions";
import BookingPaymentStatus from "@/components/bookings/BookingPaymentStatus";
import BookingTimeline from "@/components/bookings/BookingTimeline";

export default async function BookingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const isOwner = session.user.role === "OWNER" || session.user.role === "ADMIN";

    // Fetch bookings where user is the renter
    const renterBookings = await db.booking.findMany({
        where: { renterId: session.user.id },
        include: {
            listing: true,
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            payments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // For owners, fetch bookings for their listings
    const ownerBookings = isOwner
        ? await db.booking.findMany({
            where: { ownerId: session.user.id },
            include: {
                listing: true,
                renter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                payments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
            orderBy: { createdAt: "desc" },
        })
        : [];

    // Helper function to get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case "CONFIRMED":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
            case "CANCELLED":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
            case "COMPLETED":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            </div>

            <Tabs defaultValue={isOwner ? "receivedBookings" : "myBookings"} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="myBookings">My Bookings</TabsTrigger>
                    {isOwner && <TabsTrigger value="receivedBookings">Received Bookings</TabsTrigger>}
                </TabsList>

                <TabsContent value="myBookings" className="space-y-4">
                    {renterBookings.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Bookings Found</CardTitle>
                                <CardDescription>
                                    You haven't made any bookings yet.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        renterBookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{booking.listing.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <MapPin className="h-4 w-4" />
                                                {booking.listing.address || booking.listing.city || booking.listing.state || booking.listing.country || "Unknown location"}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">${booking.totalPrice}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={booking.owner.image || undefined} alt={booking.owner.name || "Host"} />
                                                    <AvatarFallback>{booking.owner.name?.charAt(0) || "H"}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{booking.owner.name}</p>
                                                    <p className="text-xs text-muted-foreground">Host</p>
                                                </div>
                                            </div>
                                            <BookingPaymentStatus payments={booking.payments.map(p => ({ ...p, createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt }))} totalAmount={booking.totalPrice} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-3">
                                    <BookingTimeline booking={{
                                        status: booking.status,
                                        createdAt: booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt,
                                        startDate: booking.startDate instanceof Date ? booking.startDate.toISOString() : booking.startDate,
                                        endDate: booking.endDate instanceof Date ? booking.endDate.toISOString() : booking.endDate,
                                    }} />
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            Message
                                        </Button>
                                        <BookingActions booking={booking} isOwner={false} />
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </TabsContent>

                {isOwner && (
                    <TabsContent value="receivedBookings" className="space-y-4">
                        {ownerBookings.length === 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>No Bookings Received</CardTitle>
                                    <CardDescription>
                                        You haven't received any booking requests yet.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ) : (
                            ownerBookings.map((booking) => (
                                <Card key={booking.id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">{booking.listing.title}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {booking.listing.address || booking.listing.city || booking.listing.state || booking.listing.country || "Unknown location"}
                                                </CardDescription>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">${booking.totalPrice}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={booking.renter.image || undefined} alt={booking.renter.name || "Renter"} />
                                                        <AvatarFallback>{booking.renter.name?.charAt(0) || "R"}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{booking.renter.name}</p>
                                                        <p className="text-xs text-muted-foreground">Renter</p>
                                                    </div>
                                                </div>
                                                <BookingPaymentStatus payments={booking.payments.map(p => ({ ...p, createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt }))} totalAmount={booking.totalPrice} />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t pt-3">
                                        <BookingTimeline booking={{
                                            status: booking.status,
                                            createdAt: booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt,
                                            startDate: booking.startDate instanceof Date ? booking.startDate.toISOString() : booking.startDate,
                                            endDate: booking.endDate instanceof Date ? booking.endDate.toISOString() : booking.endDate,
                                        }} />
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                Message
                                            </Button>
                                            <BookingActions booking={booking} isOwner={true} />
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
} 