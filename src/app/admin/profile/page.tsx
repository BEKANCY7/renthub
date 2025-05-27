"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, User } from "lucide-react";

export default function AdminProfilePage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Profile updated successfully!");
    }, 1500);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center space-y-2 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="text-2xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" type="button">
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={session?.user?.name || ""}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={session?.user?.email || ""}
                  placeholder="your.email@example.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  defaultValue={session?.user?.role || "ADMIN"}
                  disabled
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

              {successMessage && (
                <p className="text-sm text-green-600 mt-2">{successMessage}</p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium">Account Security</h4>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last login: {new Date().toLocaleDateString()}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
