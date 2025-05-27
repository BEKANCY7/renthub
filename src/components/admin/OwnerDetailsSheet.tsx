"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Home, User } from "lucide-react";

type OwnerDetailsSheetProps = {
  listingId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

type OwnerDetails = {
  id: string;
  name: string;
  email: string;
  image?: string;
  totalListings: number;
};

export function OwnerDetailsSheet({
  listingId,
  isOpen,
  onClose,
}: OwnerDetailsSheetProps) {
  const [owner, setOwner] = useState<OwnerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && listingId) {
      fetchOwnerDetails();
    }

    return () => {
      // Reset state when drawer closes
      if (!isOpen) {
        setOwner(null);
        setError(null);
      }
    };
  }, [isOpen, listingId]);

  const fetchOwnerDetails = async () => {
    if (!listingId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/listings/${listingId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch owner details");
      }

      const data = await response.json();
      setOwner(data.owner);
    } catch (error) {
      console.error("Error fetching owner details:", error);
      setError("Failed to load owner information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Property Owner</SheetTitle>
          <SheetDescription>Details about the property owner</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={fetchOwnerDetails}
              >
                Try Again
              </Button>
            </div>
          ) : owner ? (
            <>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={owner.image || ""} alt={owner.name} />
                  <AvatarFallback>
                    {owner.name?.charAt(0) || <User />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{owner.name}</h3>
                  <p className="text-sm text-muted-foreground">{owner.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 mb-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Total Properties: {owner.totalListings}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href={`mailto:${owner.email}`}>Contact Owner</a>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/admin/users/${owner.id}`} target="_blank">
                    View Full Profile
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No owner information available</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
