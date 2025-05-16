"use client";

import Link from "next/link";
import { CheckCircle2, Download, CreditCard, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PaymentSuccessPage() {
    // In a real app, we would get these details from the payment transaction
    const paymentDetails = {
        id: "TXN-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        amount: 1325.00,
        date: new Date().toISOString(),
        property: "Oak Apartment 2B",
        paymentMethod: "Visa •••• 4242",
        breakdown: [
            { name: "Rent", amount: 1250.00 },
            { name: "Utilities", amount: 75.00 }
        ]
    };

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold">Payment Successful!</h1>
                <p className="text-muted-foreground mt-2">
                    Your payment has been processed successfully.
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Payment Receipt</CardTitle>
                    <CardDescription>
                        Transaction ID: {paymentDetails.id}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Home className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Property</p>
                                <p className="text-sm text-muted-foreground">{paymentDetails.property}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Date</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(paymentDetails.date).toLocaleDateString()} at {new Date(paymentDetails.date).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Payment Method</p>
                                <p className="text-sm text-muted-foreground">{paymentDetails.paymentMethod}</p>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">Total Amount</p>
                            <p className="text-xl font-bold text-right">${paymentDetails.amount.toFixed(2)}</p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                        <p className="font-medium">Payment Breakdown</p>
                        {paymentDetails.breakdown.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{item.name}</span>
                                <span>${item.amount.toFixed(2)}</span>
                            </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${paymentDetails.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/payments/receipt/${paymentDetails.id}`}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/payments">
                            Return to Payments
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium">Payment Confirmation</h3>
                            <p className="text-sm text-muted-foreground">
                                A confirmation email with payment details has been sent to your registered email address.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                            <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium">Upcoming Payments</h3>
                            <p className="text-sm text-muted-foreground">
                                Your next payment is due on December 1, 2023. Set up autopay to ensure you never miss a payment.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/payments/autopay">
                            Setup Autopay
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 