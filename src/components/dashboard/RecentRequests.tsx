"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Check, X, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Generate mock requests - function to avoid hydration issues
const generateMockRequests = () => {
  const now = Date.now();
  return [
    {
      id: "1",
      listing: {
        id: "1",
        title: "Modern Apartment in Downtown",
      },
      startDate: new Date(now + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      endDate: new Date(now + 1000 * 60 * 60 * 24 * 10), // 10 days from now
      totalPrice: 600,
      status: "PENDING",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      renter: {
        id: "user1",
        name: "John Doe",
        image: null,
      },
    },
    {
      id: "2",
      listing: {
        id: "2",
        title: "Beach House with Ocean View",
      },
      startDate: new Date(now + 1000 * 60 * 60 * 24 * 8), // 8 days from now
      endDate: new Date(now + 1000 * 60 * 60 * 24 * 15), // 15 days from now
      totalPrice: 1750,
      status: "PENDING",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      renter: {
        id: "user2",
        name: "Jane Smith",
        image: null,
      },
    },
  ];
};

interface RecentRequestsProps {
  userId: string;
}

export function RecentRequests({ userId }: RecentRequestsProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRequests(generateMockRequests());
    setMounted(true);
  }, []);

  const handleApproveRequest = async (id: string) => {
    setIsLoading(id);
    // In a real app, you would call your API to approve the booking
    setTimeout(() => {
      setRequests(
        requests.map((request) =>
          request.id === id ? { ...request, status: "CONFIRMED" } : request
        )
      );
      setIsLoading(null);
      router.refresh();
    }, 1000);
  };

  const handleRejectRequest = async (id: string) => {
    setIsLoading(id);
    // In a real app, you would call your API to reject the booking
    setTimeout(() => {
      setRequests(
        requests.map((request) =>
          request.id === id ? { ...request, status: "CANCELLED" } : request
        )
      );
      setIsLoading(null);
      router.refresh();
    }, 1000);
  };

  if (!mounted) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Loading requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No pending booking requests</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={request.renter.image || ""}
                      alt={request.renter.name}
                    />
                    <AvatarFallback>
                      {request.renter.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{request.renter.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{request.listing.title}</div>
                <div className="text-xs text-muted-foreground">
                  Requested {format(request.createdAt, "MMM d, yyyy")}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(request.startDate, "MMM d")} -{" "}
                  {format(request.endDate, "MMM d, yyyy")}
                </div>
              </TableCell>
              <TableCell>${request.totalPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {request.status === "PENDING" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={isLoading === request.id}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request.id)}
                        disabled={isLoading === request.id}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/bookings/${request.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Link>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
