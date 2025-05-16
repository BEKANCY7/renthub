"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CreditCard,
    DollarSign,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Clock,
    Download,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const upcomingPayments = [
    {
        id: "pmt-001",
        amount: 1250,
        dueDate: "2023-11-01",
        property: "Oak Apartment 2B",
        status: "pending",
        type: "rent",
    },
    {
        id: "pmt-002",
        amount: 75,
        dueDate: "2023-11-01",
        property: "Oak Apartment 2B",
        status: "pending",
        type: "utilities",
    },
];

const paymentHistory = [
    {
        id: "pmt-101",
        amount: 1250,
        date: "2023-10-01",
        property: "Oak Apartment 2B",
        status: "completed",
        type: "rent",
        confirmationCode: "TXN12345678",
    },
    {
        id: "pmt-102",
        amount: 75,
        date: "2023-10-01",
        property: "Oak Apartment 2B",
        status: "completed",
        type: "utilities",
        confirmationCode: "TXN12345679",
    },
    {
        id: "pmt-103",
        amount: 1250,
        date: "2023-09-01",
        property: "Oak Apartment 2B",
        status: "completed",
        type: "rent",
        confirmationCode: "TXN12345680",
    },
    {
        id: "pmt-104",
        amount: 75,
        date: "2023-09-01",
        property: "Oak Apartment 2B",
        status: "completed",
        type: "utilities",
        confirmationCode: "TXN12345681",
    },
];

export default function PaymentsPage() {
    const [currentTab, setCurrentTab] = useState("upcoming");

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return (
                    <div className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        <span>Paid</span>
                    </div>
                );
            case "pending":
                return (
                    <div className="flex items-center text-yellow-600">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Due</span>
                    </div>
                );
            case "late":
                return (
                    <div className="flex items-center text-red-600">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        <span>Late</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Rent Payments</h1>
                <Button asChild>
                    <Link href="/dashboard/payments/methods">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment Methods
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Next Payment Due
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,325.00</div>
                        <p className="text-xs text-muted-foreground">
                            Due on {new Date("2023-11-01").toLocaleDateString()}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" asChild>
                            <Link href="/dashboard/payments/pay">
                                Pay Now
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Payment Balance
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">
                            No overdue payments
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/payments/history">
                                View History
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Autopay Status
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-2xl font-bold text-yellow-600">
                            <Clock className="mr-2 h-5 w-5" />
                            <span>Disabled</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Enable autopay to never miss a payment
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/payments/autopay">
                                Setup Autopay
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
                    <TabsTrigger value="history">Payment History</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Payments</CardTitle>
                            <CardDescription>
                                Manage your upcoming rent and utility payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingPayments.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingPayments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {payment.type === "rent" ? "Monthly Rent" : "Utilities"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{payment.property}</div>
                                            </div>
                                            <div className="flex-1 text-center">
                                                <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Due {new Date(payment.dueDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex items-center justify-end gap-2">
                                                {getStatusBadge(payment.status)}
                                                <Button size="sm">Pay</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
                                    <h3 className="text-lg font-medium">All Caught Up!</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You don't have any upcoming payments due.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/payments/schedule">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Schedule Payment
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/dashboard/payments/pay">Pay All</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>
                                View your recent payment history and receipts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {paymentHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {paymentHistory.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {payment.type === "rent" ? "Monthly Rent" : "Utilities"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{payment.property}</div>
                                            </div>
                                            <div className="flex-1 text-center">
                                                <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Paid {new Date(payment.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex items-center justify-end gap-2">
                                                {getStatusBadge(payment.status)}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/dashboard/payments/receipt/${payment.id}`}>
                                                        <Download className="h-3 w-3 mr-1" />
                                                        Receipt
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No Payment History</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You haven't made any payments yet.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/dashboard/payments/statements">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Annual Statement
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 