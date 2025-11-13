"use client";
// Auth handled by middleware
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Shield } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Get full user details
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  // Format role for display
  const formattedRole = user.role.charAt(0) + user.role.slice(1).toLowerCase();

  // Get some stats based on user type
  const isOwner = user.role === "OWNER" || user.role === "ADMIN";

  const bookingsCount = await db.booking.count({
    where: { renterId: user.id },
  });

  const listingsCount = isOwner
    ? await db.listing.count({
        where: { ownerId: user.id },
      })
    : 0;

  const receivedBookingsCount = isOwner
    ? await db.booking.count({
        where: { ownerId: user.id },
      })
    : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="text-2xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">
                  {user.name || "No name provided"}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Shield className="w-4 h-4" /> {formattedRole}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <ProfileForm user={user} />
          </CardContent>
        </Card>

        {/* Stats and Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bookings Made</span>
                <span className="text-lg font-bold">{bookingsCount}</span>
              </div>

              {isOwner && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Listings</span>
                    <span className="text-lg font-bold">{listingsCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Booking Requests
                    </span>
                    <span className="text-lg font-bold">
                      {receivedBookingsCount}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Account Type</span>
                <span className="font-medium">{formattedRole}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PasswordChangeForm />
              {user.role === "RENTER" && (
                <Button variant="outline" className="w-full">
                  Become a Host
                </Button>
              )}
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
