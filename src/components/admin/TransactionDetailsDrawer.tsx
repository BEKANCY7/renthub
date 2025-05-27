"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { PaymentMethodIcon } from "./PaymentMethodIcon";
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
import {
  CheckCircle,
  Flag,
  RotateCcw,
  User,
  Home,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface TransactionDetailsDrawerProps {
  transactionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function TransactionDetailsDrawer({
  transactionId,
  isOpen,
  onClose,
  onUpdate,
}: TransactionDetailsDrawerProps) {
  const [transaction, setTransaction] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Alert dialog states
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen && transactionId) {
      fetchTransactionDetails();
    }

    return () => {
      // Reset state when drawer closes
      if (!isOpen) {
        setTransaction(null);
        setError(null);
        setNotes("");
        setFlagReason("");
      }
    };
  }, [isOpen, transactionId]);

  const fetchTransactionDetails = async () => {
    if (!transactionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/transactions/${transactionId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch transaction details");
      }

      const data = await response.json();
      setTransaction(data);
      setNotes(data.notes || "");
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      setError("Failed to load transaction information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!transactionId) return;

    setIsActionLoading(true);

    try {
      const payload: any = { action };

      if (action === "flag") {
        payload.flagReason = flagReason;
        payload.notes = notes;
      } else if (notes) {
        payload.notes = notes;
      }

      const response = await fetch(`/api/admin/transactions/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} transaction`);
      }

      const updatedTransaction = await response.json();
      setTransaction(updatedTransaction);

      // Close any open dialogs
      setIsRefundDialogOpen(false);
      setIsFlagDialogOpen(false);

      // Reset flag reason if needed
      if (action === "flag") {
        setFlagReason("");
      }

      toast.success(`Transaction ${action}d successfully`);
      onUpdate(); // Refresh the parent component
    } catch (error) {
      console.error(`Error ${action}ing transaction:`, error);
      toast.error(`Failed to ${action} transaction. Please try again.`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getActionButtons = () => {
    if (!transaction) return null;

    const buttons = [];

    // Verify button (for pending or completed transactions)
    if (
      ["PENDING", "COMPLETED"].includes(transaction.status) &&
      !transaction.verifiedBy
    ) {
      buttons.push(
        <Button
          key="verify"
          onClick={() => handleAction("verify")}
          disabled={isActionLoading}
          className="flex items-center"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Verified
        </Button>
      );
    }

    // Flag button (for non-flagged transactions)
    if (!transaction.flagged) {
      buttons.push(
        <Button
          key="flag"
          variant="outline"
          onClick={() => setIsFlagDialogOpen(true)}
          disabled={isActionLoading}
          className="flex items-center"
        >
          <Flag className="mr-2 h-4 w-4" />
          Flag for Review
        </Button>
      );
    } else {
      // Unflag button (for flagged transactions)
      buttons.push(
        <Button
          key="unflag"
          variant="outline"
          onClick={() => handleAction("unflag")}
          disabled={isActionLoading}
          className="flex items-center"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Remove Flag
        </Button>
      );
    }

    // Refund button (for completed or verified transactions)
    if (["COMPLETED", "VERIFIED"].includes(transaction.status)) {
      buttons.push(
        <Button
          key="refund"
          variant="destructive"
          onClick={() => setIsRefundDialogOpen(true)}
          disabled={isActionLoading}
          className="flex items-center"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Refund Payment
        </Button>
      );
    }

    return buttons;
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription>
              View and manage transaction information
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="space-y-4 mt-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={fetchTransactionDetails}
              >
                Try Again
              </Button>
            </div>
          ) : transaction ? (
            <div className="mt-6 space-y-6">
              {/* Transaction Header */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Transaction #{transaction.id.substring(0, 8)}
                  </h3>
                  <TransactionStatusBadge status={transaction.status} />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <PaymentMethodIcon
                      method={transaction.paymentMethod}
                      showLabel={true}
                    />
                  </div>
                  <span>{formatDate(transaction.createdAt)}</span>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {formatCurrency(transaction.amount)}
                </div>
              </div>

              {/* Transaction Info Tabs */}
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="property">Property</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Reference Code
                      </p>
                      <p className="font-medium">
                        {transaction.referenceCode || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Transaction ID
                      </p>
                      <p className="font-medium">
                        {transaction.transactionId || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Payment Date
                      </p>
                      <p className="font-medium">
                        {formatDate(transaction.paymentDate)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <TransactionStatusBadge status={transaction.status} />
                    </div>
                  </div>

                  {transaction.verifiedBy && (
                    <div className="p-3 bg-green-50 rounded-md border border-green-200">
                      <p className="text-xs text-green-800">
                        Verified on {formatDate(transaction.verifiedAt)}
                      </p>
                    </div>
                  )}

                  {transaction.flagged && (
                    <div className="p-3 bg-red-50 rounded-md border border-red-200">
                      <p className="text-sm font-medium text-red-800">
                        Flag Reason:
                      </p>
                      <p className="text-xs text-red-700">
                        {transaction.flagReason || "No reason provided"}
                      </p>
                    </div>
                  )}

                  {transaction.metadata && (
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium mb-1">
                        Additional Metadata
                      </p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(
                          JSON.parse(transaction.metadata),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="mt-4 space-y-4">
                  <div className="border rounded-md p-3 space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Payer</p>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={transaction.payer.image || ""}
                            alt={transaction.payer.name || "User"}
                          />
                          <AvatarFallback>
                            {transaction.payer.name?.charAt(0) || <User />}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {transaction.payer.name || "Unnamed User"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.payer.email}
                          </p>
                          {transaction.payer.phoneNumber && (
                            <p className="text-xs text-muted-foreground">
                              {transaction.payer.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Receiver</p>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={transaction.receiver.image || ""}
                            alt={transaction.receiver.name || "User"}
                          />
                          <AvatarFallback>
                            {transaction.receiver.name?.charAt(0) || <User />}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {transaction.receiver.name || "Unnamed User"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.receiver.email}
                          </p>
                          {transaction.receiver.phoneNumber && (
                            <p className="text-xs text-muted-foreground">
                              {transaction.receiver.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Property Tab */}
                <TabsContent value="property" className="mt-4 space-y-4">
                  {transaction.booking?.listing ? (
                    <div className="border rounded-md p-3 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden relative">
                          {transaction.booking.listing.imageUrls && (
                            <img
                              src={
                                transaction.booking.listing.imageUrls.split(
                                  ","
                                )[0]
                              }
                              alt={transaction.booking.listing.title}
                              className="object-cover h-full w-full"
                              onError={(e) => {
                                e.currentTarget.src = "/images/placeholder.jpg";
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.booking.listing.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.booking.listing.address},{" "}
                            {transaction.booking.listing.city}
                          </p>
                          <p className="text-sm font-medium">
                            {formatCurrency(transaction.booking.listing.price)}
                            /month
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {format(
                              new Date(transaction.booking.startDate),
                              "MMM d"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(transaction.booking.endDate),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            Total:{" "}
                            {formatCurrency(transaction.booking.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No property information available</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this transaction"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      setIsActionLoading(true);
                      const response = await fetch(
                        `/api/admin/transactions/${transactionId}`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ notes }),
                        }
                      );

                      if (!response.ok) {
                        throw new Error("Failed to save notes");
                      }

                      toast.success("Notes saved successfully");
                    } catch (error) {
                      toast.error("Failed to save notes");
                    } finally {
                      setIsActionLoading(false);
                    }
                  }}
                  disabled={isActionLoading}
                >
                  Save Notes
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex flex-wrap gap-2">
                {getActionButtons()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transaction information available</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Refund Confirmation Dialog */}
      <AlertDialog
        open={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the transaction as refunded. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction("refund")}
              disabled={isActionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isActionLoading ? "Processing..." : "Refund"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag Dialog */}
      <AlertDialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for flagging this transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="flagReason">Reason</Label>
            <Textarea
              id="flagReason"
              placeholder="Enter reason for flagging this transaction"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction("flag")}
              disabled={isActionLoading || !flagReason.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isActionLoading ? "Processing..." : "Flag Transaction"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
