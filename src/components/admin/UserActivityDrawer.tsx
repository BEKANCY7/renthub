"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Activity, DollarSign, Home, Calendar } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRoleFilter } from "./UserRoleFilter";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserActivityDrawerProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type UserDetails = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  listings: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    price: number;
  }>;
  bookings: Array<{
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    listing?: {
      id: string;
      title: string;
    };
  }>;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  receivedPayments: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  _count: {
    listings: number;
    bookings: number;
    payments: number;
    receivedPayments: number;
  };
  totalRevenue: number;
};

export function UserActivityDrawer({
  userId,
  isOpen,
  onClose,
}: UserActivityDrawerProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to load user information");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }

    return () => {
      // Reset state when drawer closes
      if (!isOpen) {
        setUser(null);
        setError(null);
      }
    };
  }, [isOpen, userId, fetchUserDetails]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Activity</SheetTitle>
          <SheetDescription>
            View detailed activity for this user
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 mt-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchUserDetails}
            >
              Try Again
            </Button>
          </div>
        ) : user ? (
          <div className="mt-6 space-y-6">
            {/* User Header */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={""} alt={user.name || "User"} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <UserRoleFilter role={user.role} />
                  <UserStatusBadge status={user.status} />
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
                <Home className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">
                  {user._count.listings} Listings
                </span>
              </div>
              <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
                <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">
                  {user._count.bookings} Bookings
                </span>
              </div>
              <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">
                  {user._count.payments} Payments
                </span>
              </div>
              <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
                <Activity className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">
                  {formatCurrency(user.totalRevenue)}
                </span>
              </div>
            </div>

            {/* Activity Tabs */}
            <Tabs defaultValue="listings">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="received">Revenue</TabsTrigger>
              </TabsList>

              {/* Listings Tab */}
              <TabsContent value="listings" className="mt-4">
                {user.listings.length > 0 ? (
                  <div className="space-y-4">
                    {user.listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="border rounded-md p-3 space-y-2"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{listing.title}</h4>
                          <Badge
                            variant={
                              listing.status === "ACTIVE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatCurrency(listing.price)}/month</span>
                          <span>{formatDate(listing.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No listings found
                  </p>
                )}
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="mt-4">
                {user.bookings.length > 0 ? (
                  <div className="space-y-4">
                    {user.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border rounded-md p-3 space-y-2"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {booking.listing?.title || "Unnamed Listing"}
                          </h4>
                          <Badge
                            variant={
                              booking.status === "CONFIRMED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {formatDate(booking.startDate)} -{" "}
                            {formatDate(booking.endDate)}
                          </span>
                          <span>{formatCurrency(booking.totalPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No bookings found
                  </p>
                )}
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="mt-4">
                {user.payments.length > 0 ? (
                  <div className="space-y-4">
                    {user.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="border rounded-md p-3 space-y-2"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            Payment {payment.id.substring(0, 8)}
                          </h4>
                          <Badge
                            variant={
                              payment.status === "COMPLETED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatDate(payment.createdAt)}</span>
                          <span>{formatCurrency(payment.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No payments found
                  </p>
                )}
              </TabsContent>

              {/* Received Payments Tab */}
              <TabsContent value="received" className="mt-4">
                {user.receivedPayments.length > 0 ? (
                  <div className="space-y-4">
                    {user.receivedPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="border rounded-md p-3 space-y-2"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            Revenue {payment.id.substring(0, 8)}
                          </h4>
                          <Badge
                            variant={
                              payment.status === "COMPLETED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatDate(payment.createdAt)}</span>
                          <span>{formatCurrency(payment.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No revenue found
                  </p>
                )}
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                User registered on {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No user information available</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
