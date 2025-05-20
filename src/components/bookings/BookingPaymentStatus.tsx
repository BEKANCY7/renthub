"use client";

import { DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Payment = {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
};

type BookingPaymentStatusProps = {
    payments: Payment[];
    totalAmount: number;
};

export default function BookingPaymentStatus({ payments, totalAmount }: BookingPaymentStatusProps) {
    const router = useRouter();

    const totalPaid = payments
        .filter(payment => payment.status === "COMPLETED")
        .reduce((sum, payment) => sum + payment.amount, 0);

    const remainingAmount = totalAmount - totalPaid;
    const isFullyPaid = remainingAmount <= 0;

    const getPaymentStatus = () => {
        if (isFullyPaid) {
            return (
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Fully Paid</span>
                </div>
            );
        }

        if (payments.length > 0) {
            return (
                <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Partially Paid</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Payment Required</span>
            </div>
        );
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Status</span>
                {getPaymentStatus()}
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-medium">${totalAmount}</span>
                </div>

                {!isFullyPaid && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className="font-medium text-red-600">${remainingAmount}</span>
                    </div>
                )}

                {payments.length > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paid</span>
                        <span className="font-medium text-green-600">${totalPaid}</span>
                    </div>
                )}
            </div>

            {!isFullyPaid && (
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => router.push(`/payments/new?amount=${remainingAmount}`)}
                >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Make Payment
                </Button>
            )}
        </div>
    );
} 