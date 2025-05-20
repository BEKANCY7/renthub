"use client";

import { Calendar, MapPin, Home, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type User = {
    id: string;
    name: string;
    email: string;
    image?: string;
};

type Listing = {
    id: string;
    title: string;
    images: string[];
    address: string;
};

type BookingDetailsProps = {
    booking: {
        id: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
        status: string;
        listing: Listing;
        renter: User;
        owner: User;
    };
    isOwner: boolean;
};

export default function BookingDetails({ booking, isOwner }: BookingDetailsProps) {
    const otherUser = isOwner ? booking.renter : booking.owner;

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                {/* Listing Information */}
                <div className="space-y-4">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                        <Image
                            src={booking.listing.images[0] || "/placeholder.jpg"}
                            alt={booking.listing.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-2">
                        <Link
                            href={`/listings/${booking.listing.id}`}
                            className="text-lg font-semibold hover:underline"
                        >
                            {booking.listing.title}
                        </Link>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.listing.address}
                        </div>
                    </div>
                </div>

                {/* Dates and Price */}
                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                            {format(new Date(booking.startDate), "MMM d, yyyy")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                        </span>
                    </div>

                    <div className="flex items-center text-sm font-medium">
                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Total: ${booking.totalPrice}</span>
                    </div>
                </div>

                {/* User Information */}
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={otherUser.image} />
                        <AvatarFallback>
                            {otherUser.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <div className="font-medium">{otherUser.name}</div>
                        <div className="text-sm text-muted-foreground">{otherUser.email}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 