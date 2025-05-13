"use client";

import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { CalendarClock, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data - in a real app this would come from your database
const mockBookings = [
    {
        id: "1",
        listing: {
            id: "1",
            title: "Modern Apartment in Downtown",
            imageUrls: "/images/apartments/1.jpg",
            city: "New York",
            country: "USA",
        },
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
        totalPrice: 600,
        status: "CONFIRMED",
    },
    {
        id: "2",
        listing: {
            id: "2",
            title: "Beach House with Ocean View",
            imageUrls: "/images/houses/1.jpg",
            city: "Miami",
            country: "USA",
        },
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20), // 20 days from now
        totalPrice: 1250,
        status: "CONFIRMED",
    },
];

interface UpcomingBookingsProps {
    userId: string;
}

export function UpcomingBookings({ userId }: UpcomingBookingsProps) {
    // In a real app, you would fetch this data from your API
    const bookings = mockBookings;

    if (bookings.length === 0) {
        return (
            <div className="text-center p-6">
                <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                <Button asChild>
                    <Link href="/search">Plan your next trip</Link>
                </Button>
            </div>
        );
    }

    const now = new Date();

    return (
        <div className="space-y-4">
            {bookings.map((booking) => {
                const daysUntilTrip = differenceInDays(booking.startDate, now);
                const progressValue = 100 - (daysUntilTrip / 30) * 100;

                return (
                    <Card key={booking.id}>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <h3 className="font-medium">{booking.listing.title}</h3>
                                    <span className="text-sm text-muted-foreground">
                                        ${booking.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {booking.listing.city}, {booking.listing.country}
                                </div>
                                <div className="flex items-center text-sm">
                                    <CalendarClock className="mr-1 h-3 w-3" />
                                    <span>
                                        {format(booking.startDate, "MMM d")} - {format(booking.endDate, "MMM d, yyyy")}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{daysUntilTrip} days until your trip</span>
                                        <span>{format(booking.startDate, "MMM d")}</span>
                                    </div>
                                    <Progress value={progressValue} className="h-1" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-4 pt-0">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/bookings/${booking.id}`}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Contact Host
                                </Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={`/dashboard/bookings/${booking.id}`}>View Details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
} 