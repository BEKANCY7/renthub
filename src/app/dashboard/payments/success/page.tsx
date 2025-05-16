"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, DownloadIcon, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount") || "25000";
    const method = searchParams.get("method") || "TeleBirr";

    const transactionId = "TXN" + Math.floor(Math.random() * 10000000).toString().padStart(8, '0');
    const date = new Date();

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <div className="flex justify-center mb-8">
                <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">Payment Successful!</h1>
            <p className="text-gray-500 text-center mb-8">
                Your payment has been successfully processed. You can find the payment details below.
            </p>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Amount Paid</span>
                        <span className="font-bold">ETB {parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Payment Method</span>
                        <span>{method}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-mono">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Date & Time</span>
                        <span>{date.toLocaleString("en-ET", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="text-green-600 font-medium flex items-center">
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Confirmed
                        </span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" size="sm">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download Receipt
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Next Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Next Due Date</span>
                        <span className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            December 1, 2023
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Expected Amount</span>
                        <span>ETB {parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Auto-Pay Status</span>
                        <span className="flex items-center text-yellow-600">
                            <Clock className="mr-2 h-4 w-4" />
                            Not Enabled
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-3">
                    <Button variant="outline" asChild className="flex-1">
                        <Link href="/dashboard/payments">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payments
                        </Link>
                    </Button>
                    <Button asChild className="flex-1">
                        <Link href="/dashboard/payments/autopay">
                            Set Up Auto-Pay
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 