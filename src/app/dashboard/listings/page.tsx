import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
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
import DeleteListingButton from "@/components/listing/DeleteListingButton";

export default async function ListingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is an owner or admin
  const isOwner =
    session.user.role === "OWNER" || session.user.role === "ADMIN";
  if (!isOwner) {
    redirect("/dashboard");
  }

  // Fetch user's listings
  const listings = await db.listing.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      bookings: {
        where: {
          status: "PENDING",
        },
      },
    },
  });

  // Helper function for status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Listing
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Listings Found</CardTitle>
            <CardDescription>
              You haven&apos;t created any property listings yet.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Listing
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={
                    listing.imageUrls ||
                    "https://source.unsplash.com/random/?property,ethiopia"
                  }
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${getStatusColor(
                    listing.status
                  )}`}
                >
                  {listing.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {listing.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-xl font-bold">
                      ETB {listing.price.toLocaleString()}/month
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending Requests</p>
                    <p className="text-xl font-bold text-center">
                      {listing.bookings.length}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm">
                    {listing.city},{" "}
                    {listing.state || listing.country || "Ethiopia"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listings/${listing.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/listings/edit/${listing.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <DeleteListingButton id={listing.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
