"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  iconOnly?: boolean;
}

export default function FavoriteButton({
  listingId,
  className,
  variant = "outline",
  size = "sm",
  iconOnly = false,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleFavorite = async () => {
    // Redirect to login if not authenticated
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/listings/${listingId}`);
      return;
    }

    setIsLoading(true);

    try {
      // Toggle favorite status
      setIsFavorite(!isFavorite);

      // Show success message
      if (!isFavorite) {
        toast.success("Added to favorites");
      } else {
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={toggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${!iconOnly ? "mr-2" : ""} h-4 w-4 ${
          isFavorite ? "fill-red-500 text-red-500" : ""
        }`}
      />
      {!iconOnly && (isFavorite ? "Saved" : "Save")}
    </Button>
  );
}
