"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

// Mock bookings data - loads instantly
const mockRenterBookings = [
  {
    id: "booking1",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    totalPrice: 7500,
    status: "CONFIRMED",
    listing: {
      id: "listing1",
      title: "Modern Apartment in Bole",
      imageUrls: "/images/property-placeholder.jpg",
      city: "Addis Ababa",
      price: 1500,
    },
    owner: {
      name: "John Doe",
      image: null,
    },
  },
  {
    id: "booking2",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    totalPrice: 4000,
    status: "COMPLETED",
    listing: {
      id: "listing2",
      title: "Cozy Studio Near University",
      imageUrls: "/images/property-placeholder.jpg",
      city: "Addis Ababa",
      price: 800,
    },
    owner: {
      name: "Jane Smith",
      image: null,
    },
  },
];

const mockOwnerBookings = [
  {
    id: "booking3",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    totalPrice: 6000,
    status: "PENDING",
    listing: {
      id: "listing3",
      title: "Luxury Villa in Bole",
      imageUrls: "/images/property-placeholder.jpg",
      city: "Addis Ababa",
      price: 1200,
    },
    renter: {
      name: "Mike Johnson",
      image: null,
    },
  },
];

export default function BookingsPage() {
  // Use mock data - no loading delay
  const renterBookings = mockRenterBookings;
  const ownerBookings = mockOwnerBookings;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const BookingCard = ({ booking, isOwner = false }: any) => (
    <Card key={booking.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{booking.listing.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {booking.listing.city}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(booking.status)}
              {booking.status}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-video w-full overflow-hidden rounded-md">
          <img
            src={booking.listing.imageUrls.split(",")[0]}
            alt={booking.listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium text-foreground">Check-in</p>
              <p>{format(booking.startDate, "MMM d, yyyy")}</p>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium text-foreground">Check-out</p>
              <p>{format(booking.endDate, "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="text-lg font-bold text-foreground">
              ETB {booking.totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {isOwner
              ? `Renter: ${booking.renter.name}`
              : `Host: ${booking.owner.name}`}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/dashboard/bookings/${booking.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        {booking.status === "PENDING" && isOwner && (
          <>
            <Button variant="outline" className="flex-1">
              Accept
            </Button>
            <Button variant="outline" className="flex-1">
              Decline
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
      </div>

      <Tabs defaultValue="renter" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="renter">My Bookings</TabsTrigger>
          <TabsTrigger value="owner">Booking Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="renter" className="mt-6">
          {renterBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No bookings yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start exploring properties to make your first booking
                </p>
                <Button asChild>
                  <Link href="/listings">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renterBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="owner" className="mt-6">
          {ownerBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No booking requests</p>
                <p className="text-sm text-muted-foreground">
                  You haven't received any booking requests yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownerBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isOwner />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
