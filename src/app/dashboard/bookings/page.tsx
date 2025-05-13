import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                    name: true,
                    email: true,
                },
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
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
        : [];

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
                            <Card key={booking.id}>
                                <CardHeader>
                                    <CardTitle>{booking.listing.title}</CardTitle>
                                    <CardDescription>
                                        Booked from {new Date(booking.startDate).toLocaleDateString()} to{" "}
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium">Status</p>
                                            <p className="text-sm">{booking.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Total Price</p>
                                            <p className="text-sm">${booking.totalPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Host</p>
                                            <p className="text-sm">{booking.owner.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Contact</p>
                                            <p className="text-sm">{booking.owner.email}</p>
                                        </div>
                                    </div>
                                </CardContent>
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
                                <Card key={booking.id}>
                                    <CardHeader>
                                        <CardTitle>{booking.listing.title}</CardTitle>
                                        <CardDescription>
                                            Booked from {new Date(booking.startDate).toLocaleDateString()} to{" "}
                                            {new Date(booking.endDate).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium">Status</p>
                                                <p className="text-sm">{booking.status}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Total Price</p>
                                                <p className="text-sm">${booking.totalPrice}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Renter</p>
                                                <p className="text-sm">{booking.renter.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Contact</p>
                                                <p className="text-sm">{booking.renter.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
} 