"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Edit,
  User,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Flag,
  Star,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { EditListingModal } from "@/components/admin/EditListingModal";
import { OwnerDetailsSheet } from "@/components/admin/OwnerDetailsSheet";

// Property types for filtering
const propertyTypes = [
  { value: "ALL", label: "All Types" },
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "CABIN", label: "Cabin" },
  { value: "VILLA", label: "Villa" },
];

// Listing status options
const statusOptions = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
];

// Define listing type
interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  createdAt: string;
  description: string;
  imageUrls: string;
  featured?: boolean;
  flagged?: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminListingsPage() {
  // State for listings and filters
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  // State for modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ownerDetailsOpen, setOwnerDetailsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Memoize fetchListings function to avoid recreating it on every render
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (propertyType !== "ALL") params.append("type", propertyType);
      if (status !== "ALL") params.append("status", status);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/listings?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  }, [propertyType, status, searchQuery]);

  // Fetch listings on component mount and when filters change
  useEffect(() => {
    fetchListings();
  }, [propertyType, status, fetchListings]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  // Handle listing actions
  const handleAction = async (
    listingId: string,
    action: string,
    actionLabel: string
  ) => {
    try {
      let data: Record<string, boolean | string> = {};

      switch (action) {
        case "approve":
          data = { status: "ACTIVE" };
          break;
        case "reject":
          data = { status: "INACTIVE" };
          break;
        case "pending":
          data = { status: "PENDING" };
          break;
        case "feature":
          // Assuming we add a featured field to the schema
          data = { featured: true };
          break;
        case "unfeature":
          data = { featured: false };
          break;
        case "flag":
          data = { flagged: true };
          break;
        default:
          return;
      }

      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${actionLabel} listing`);
      }

      toast.success(`Listing ${actionLabel} successfully`);
      fetchListings(); // Refresh listings
    } catch (error) {
      console.error(`Error ${actionLabel} listing:`, error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${actionLabel} listing`
      );
    }
  };

  // Open edit modal with selected listing
  const openEditModal = (listing: Listing) => {
    setSelectedListing(listing);
    setEditModalOpen(true);
  };

  // Open owner details sheet with selected listing
  const openOwnerDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setOwnerDetailsOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (
    status: string
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "ACTIVE":
        return "default"; // Using default for success
      case "INACTIVE":
        return "destructive";
      case "PENDING":
        return "secondary"; // Using secondary for warning
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Property Listings
          </h1>
          <p className="text-muted-foreground">
            Manage property listings on the platform
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Listings</CardTitle>
          <CardDescription>Filter and search property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Property Type
              </label>
              <Select
                value={propertyType}
                onValueChange={(value) => setPropertyType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <form
                onSubmit={handleSearch}
                className="flex items-end gap-2 h-full"
              >
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search listings..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Property Listings</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading listings..."
              : `Showing ${listings.length} properties`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="py-3 text-left font-medium">Type</th>
                  <th className="py-3 text-left font-medium">Price</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Submitted</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Loading listings...
                      </p>
                    </td>
                  </tr>
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <p className="text-muted-foreground">No listings found</p>
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr key={listing.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-medium">{listing.title}</td>
                      <td className="py-3">{listing.category}</td>
                      <td className="py-3">
                        ${listing.price.toFixed(2)}/month
                      </td>
                      <td className="py-3">
                        <Badge variant={getStatusBadgeVariant(listing.status)}>
                          {listing.status}
                        </Badge>
                      </td>
                      <td className="py-3">{formatDate(listing.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(listing)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openOwnerDetails(listing)}
                          >
                            <User className="h-4 w-4 mr-1" />
                            Owner
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction(
                                    listing.id,
                                    "approve",
                                    "approved"
                                  )
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction(listing.id, "reject", "rejected")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction(
                                    listing.id,
                                    "pending",
                                    "marked as pending"
                                  )
                                }
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Request Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {listing.featured ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction(
                                      listing.id,
                                      "unfeature",
                                      "unfeatured"
                                    )
                                  }
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  Unfeature
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction(
                                      listing.id,
                                      "feature",
                                      "featured"
                                    )
                                  }
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  Feature
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction(listing.id, "flag", "flagged")
                                }
                                className="text-red-600"
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                Flag as Inappropriate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {selectedListing && (
        <EditListingModal
          listing={selectedListing}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={fetchListings}
        />
      )}

      {/* Owner Details Sheet */}
      <OwnerDetailsSheet
        listingId={selectedListing?.id || null}
        isOpen={ownerDetailsOpen}
        onClose={() => setOwnerDetailsOpen(false)}
      />
    </div>
  );
}
