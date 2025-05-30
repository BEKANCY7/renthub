"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, Copy, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const amount = searchParams.get("amount");

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [receiptNumber] = useState(`RH-${Date.now().toString().slice(-8)}`);

  useEffect(() => {
    // If there's a payment ID, fetch the payment details
    if (paymentId) {
      fetchPaymentDetails();
    } else {
      // Otherwise, just show basic success with the amount
      setLoading(false);
    }
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(`/api/payments?paymentId=${paymentId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch payment details");
      }

      const data = await response.json();
      setPayment(data.payments[0]);
    } catch (error) {
      console.error("Error fetching payment:", error);
      toast.error("Could not load payment details");
    } finally {
      setLoading(false);
    }
  };

  const copyReceiptToClipboard = () => {
    const receiptText = `
      RentHub Payment Receipt
      ----------------------
      Receipt No: ${receiptNumber}
      Date: ${new Date().toLocaleDateString()}
      Amount: ETB ${payment ? payment.amount : amount}
      Status: Completed
      Payment Method: ${payment ? payment.paymentMethod : "Online Payment"}
      Reference: ${payment ? payment.referenceCode : "-"}
      
      Thank you for your payment!
    `;

    navigator.clipboard.writeText(receiptText.trim());
    toast.success("Receipt copied to clipboard");
  };

  const downloadReceipt = () => {
    // In a real app, this would generate a PDF receipt
    toast.success("Receipt download started");
  };

  const shareReceipt = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "RentHub Payment Receipt",
          text: `I've successfully paid ETB ${
            payment ? payment.amount : amount
          } for my rental on RentHub!`,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      toast.info("Sharing not supported on this browser");
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/payments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Link>
      </Button>

      <Card className="border-green-100">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-green-700">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your payment has been processed successfully
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Receipt Number
              </span>
              <span className="font-medium">{receiptNumber}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="text-xl font-bold">
                ETB {payment ? payment.amount : amount}
              </span>
            </div>

            <Separator />

            {payment && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Payment Method
                  </span>
                  <span className="font-medium">{payment.paymentMethod}</span>
                </div>

                {payment.referenceCode && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Reference Code
                    </span>
                    <span className="font-medium">{payment.referenceCode}</span>
                  </div>
                )}

                {payment.booking && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Property
                    </span>
                    <span className="font-medium">
                      {payment.booking.listing?.title || "Property Rental"}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Completed</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={downloadReceipt}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={copyReceiptToClipboard}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" className="flex-1" onClick={shareReceipt}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <Button asChild className="w-full">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
