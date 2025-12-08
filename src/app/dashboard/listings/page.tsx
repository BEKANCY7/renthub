"use client";
// TODO: Connect to your external backend API
// import { authenticatedFetch, getUser } from "@/lib/api";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Plus } from "lucide-react";

export default function ListingsPage() {
  // TODO: Fetch from your backend API
  // const user = getUser();
  // const response = await authenticatedFetch(`/listings?ownerId=${user?.id}`);
  // const listings = await response.json();

  // Mock data for UI demonstration
  const listings: any[] = [];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <Plus className="mr-2 h-4 w-4" /> Create Listing
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-medium">No listings yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first listing to start renting
            </p>
            <Button asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="mr-2 h-4 w-4" /> Create Listing
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Listing cards would go here */}
        </div>
      )}
    </div>
  );
}
