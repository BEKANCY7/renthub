"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyListings } from "@/lib/api";
import { Listing } from "@/types";
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
import { Eye, Edit, Plus, MapPin, DollarSign } from "lucide-react";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await getMyListings();
        console.log("Fetched listings data:", data);
        console.log("Is array?", Array.isArray(data));
        // Ensure we always have an array
        setListings(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to fetch listings:", err);
        setError(err.message || "Failed to fetch listings");
        setListings([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

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

  if (loading) {
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
        <div className="flex items-center justify-center py-10">
          <p className="text-lg">Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-medium text-red-600">
              Error loading listings
            </p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {Array.isArray(listings) &&
            listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {listing.title}
                    </CardTitle>
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.address
                      ? `${listing.address}, ${listing.city}, ${listing.state}`
                      : "Location not specified"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-lg">
                      ${listing.price || "0"}
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </span>
                  </div>

                  {listing.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {listing.description}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
                    {listing.bedrooms && (
                      <span>
                        {listing.bedrooms} bed{listing.bedrooms > 1 ? "s" : ""}
                      </span>
                    )}
                    {listing.bathrooms && (
                      <span>
                        {listing.bathrooms} bath
                        {listing.bathrooms > 1 ? "s" : ""}
                      </span>
                    )}
                    {listing.squareFeet && (
                      <span>{listing.squareFeet} sqft</span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <Link href={`/listings/${listing.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <Link href={`/dashboard/listings/${listing.id}/edit`}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
