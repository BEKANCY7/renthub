"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

type BookingActionsProps = {
    booking: {
        id: string;
        status: string;
    };
    isOwner: boolean;
};

export default function BookingActions({ booking, isOwner }: BookingActionsProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/bookings/${booking.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update booking status");
            }

            toast({
                title: "Booking updated",
                description: `Booking has been ${newStatus.toLowerCase()}`,
            });

            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getActionButton = () => {
        if (isOwner) {
            switch (booking.status) {
                case "PENDING":
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" disabled={isLoading}>
                                    Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => handleStatusChange("CONFIRMED")}
                                    className="text-green-600"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setShowCancelDialog(true)}
                                    className="text-red-600"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Booking
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                case "CONFIRMED":
                    return (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange("COMPLETED")}
                            disabled={isLoading}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                        </Button>
                    );
                default:
                    return null;
            }
        } else {
            // Renter actions
            if (booking.status === "PENDING") {
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCancelDialog(true)}
                        disabled={isLoading}
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Request
                    </Button>
                );
            }
            return null;
        }
    };

    return (
        <>
            {getActionButton()}

            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No, keep it</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleStatusChange("CANCELLED")}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Yes, cancel booking
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
} 