import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default async function PaymentsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const isOwner = session.user.role === "OWNER" || session.user.role === "ADMIN";

    // Fetch outgoing payments where user is the payer
    const outgoingPayments = await db.payment.findMany({
        where: { payerId: session.user.id },
        include: {
            booking: {
                include: {
                    listing: true,
                },
            },
            receiver: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // For owners, fetch incoming payments where user is the receiver
    const incomingPayments = isOwner
        ? await db.payment.findMany({
            where: { receiverId: session.user.id },
            include: {
                booking: {
                    include: {
                        listing: true,
                    },
                },
                payer: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
        : [];

    // Calculate totals
    const totalOutgoing = outgoingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalIncoming = incomingPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Helper function to get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            case "REFUNDED":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Payments Made</CardTitle>
                        <CardDescription>
                            All your outgoing payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${totalOutgoing.toFixed(2)}</p>
                    </CardContent>
                </Card>

                {isOwner && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Payments Received</CardTitle>
                            <CardDescription>
                                All your incoming payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">${totalIncoming.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Tabs defaultValue={isOwner ? "incoming" : "outgoing"} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="outgoing">Payments Made</TabsTrigger>
                    {isOwner && <TabsTrigger value="incoming">Payments Received</TabsTrigger>}
                </TabsList>

                <TabsContent value="outgoing" className="space-y-4">
                    {outgoingPayments.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Payments Found</CardTitle>
                                <CardDescription>
                                    You haven't made any payments yet.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        outgoingPayments.map((payment) => (
                            <Card key={payment.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{payment.booking.listing.title}</CardTitle>
                                        <Badge className={getStatusColor(payment.status)}>
                                            {payment.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Payment date: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "Not processed yet"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium">Amount</p>
                                            <p className="text-xl font-bold">${payment.amount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Recipient</p>
                                            <p className="text-sm">{payment.receiver.name}</p>
                                            <p className="text-xs text-gray-500">{payment.receiver.email}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                {isOwner && (
                    <TabsContent value="incoming" className="space-y-4">
                        {incomingPayments.length === 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>No Payments Received</CardTitle>
                                    <CardDescription>
                                        You haven't received any payments yet.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ) : (
                            incomingPayments.map((payment) => (
                                <Card key={payment.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>{payment.booking.listing.title}</CardTitle>
                                            <Badge className={getStatusColor(payment.status)}>
                                                {payment.status}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Payment date: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "Not processed yet"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium">Amount</p>
                                                <p className="text-xl font-bold">${payment.amount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">From</p>
                                                <p className="text-sm">{payment.payer.name}</p>
                                                <p className="text-xs text-gray-500">{payment.payer.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
} 