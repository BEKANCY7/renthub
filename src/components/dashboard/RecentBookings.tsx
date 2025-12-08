"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Star, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Generate mock bookings - function to avoid hydration issues
const generateMockBookings = () => {
  const now = Date.now();
  return [
    {
      id: "1",
      listing: {
        id: "1",
        title: "Modern Apartment in Bole",
        imageUrls: "/images/apartments/1.jpg",
      },
      startDate: new Date(now - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      endDate: new Date(now - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      totalPrice: 15000,
      status: "COMPLETED",
    },
    {
      id: "2",
      listing: {
        id: "2",
        title: "Family House in Sarbet",
        imageUrls: "/images/houses/1.jpg",
      },
      startDate: new Date(now - 1000 * 60 * 60 * 24 * 20), // 20 days ago
      endDate: new Date(now - 1000 * 60 * 60 * 24 * 17), // 17 days ago
      totalPrice: 32000,
      status: "COMPLETED",
    },
    {
      id: "3",
      listing: {
        id: "3",
        title: "Studio Near Addis Ababa University",
        imageUrls: "/images/cabins/1.jpg",
      },
      startDate: new Date(now - 1000 * 60 * 60 * 24 * 25), // 25 days ago
      endDate: new Date(now - 1000 * 60 * 60 * 24 * 23), // 23 days ago
      totalPrice: 12000,
      status: "CANCELLED",
    },
  ];
};

interface RecentBookingsProps {
  userId: string;
}

export function RecentBookings({ userId }: RecentBookingsProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBookings(generateMockBookings());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground mb-4">No recent bookings found</p>
        <Button asChild>
          <Link href="/find-home">Find a place to stay</Link>
        </Button>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rental</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="font-medium">{booking.listing.title}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(booking.startDate, "MMM d")} -{" "}
                  {format(booking.endDate, "MMM d, yyyy")}
                </div>
              </TableCell>
              <TableCell>ETB {booking.totalPrice.toLocaleString()}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status === "COMPLETED" ? "Completed" : "Cancelled"}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {booking.status === "COMPLETED" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/reviews/new?bookingId=${booking.id}`}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Review
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
