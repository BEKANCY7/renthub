"use client";

import Link from "next/link";
import { Home, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// This would be fetched from your database in a real app
const mockListings = [
    {
        id: "1",
        title: "Modern Apartment in Downtown",
        price: 120,
        category: "APARTMENT",
        status: "ACTIVE",
        createdAt: "2023-09-15T12:00:00Z",
    },
    {
        id: "2",
        title: "Beach House with Ocean View",
        price: 250,
        category: "HOUSE",
        status: "ACTIVE",
        createdAt: "2023-09-12T10:30:00Z",
    },
    {
        id: "3",
        title: "Cozy Cabin in the Mountains",
        price: 90,
        category: "CABIN",
        status: "INACTIVE",
        createdAt: "2023-09-08T16:45:00Z",
    },
    {
        id: "4",
        title: "Luxury Villa with Pool",
        price: 350,
        category: "VILLA",
        status: "ACTIVE",
        createdAt: "2023-09-05T09:15:00Z",
    },
];

interface RecentListingsProps {
    userId: string;
}

export function RecentListings({ userId }: RecentListingsProps) {
    const router = useRouter();

    // In a real app, you would fetch this data from your API
    const listings = mockListings;

    const handleToggleStatus = (id: string, currentStatus: string) => {
        // In a real app, you would call your API to update the status
        console.log(`Toggling status for listing ${id} from ${currentStatus}`);
        router.refresh();
    };

    return (
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listings.map((listing) => (
                        <TableRow key={listing.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-md w-10 h-10 bg-gray-100 flex items-center justify-center">
                                        <Home className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div className="font-medium">{listing.title}</div>
                                </div>
                            </TableCell>
                            <TableCell>${listing.price}/night</TableCell>
                            <TableCell>
                                <div
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${listing.status === "ACTIVE"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {listing.status === "ACTIVE" ? "Active" : "Inactive"}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleToggleStatus(
                                                listing.id,
                                                listing.status
                                            )
                                        }
                                    >
                                        {listing.status === "ACTIVE" ? (
                                            <ToggleRight className="h-4 w-4" />
                                        ) : (
                                            <ToggleLeft className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Toggle status</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Link>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 