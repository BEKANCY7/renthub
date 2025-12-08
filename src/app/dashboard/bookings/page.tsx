"use client";
// TODO: Connect to your external backend API
// import { authenticatedFetch, getUser } from "@/lib/api";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function BookingsPage() {
  // TODO: Fetch from your backend API
  // const user = getUser();
  // const response = await authenticatedFetch(`/bookings?userId=${user?.id}`);
  // const bookings = await response.json();

  // Mock data for UI demonstration
  const renterBookings: any[] = [];
  const ownerBookings: any[] = [];

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
                <Button>Browse Listings</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Booking cards would go here */}
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
            <div className="grid gap-4">
              {/* Booking request cards would go here */}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
