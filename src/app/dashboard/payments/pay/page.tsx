"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { ArrowLeft, CreditCard, DollarSign, CheckCircle2, Building, AlertCircle, Plus } from "lucide-react";

// Mock payment methods data
const paymentMethods = [
    {
        id: "pm-1",
        type: "card",
        last4: "4242",
        brand: "Visa",
        expMonth: 12,
        expYear: 2024,
        default: true,
    },
    {
        id: "pm-2",
        type: "bank",
        last4: "9876",
        bankName: "Chase",
        accountType: "checking",
        default: false,
    },
];

export default function PayRentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(paymentMethods[0].id);
    const [amount, setAmount] = useState("1325.00");
    const [includeUtilities, setIncludeUtilities] = useState(true);
    const [savePaymentMethod, setSavePaymentMethod] = useState(false);
    const [autoPayEnabled, setAutoPayEnabled] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // In a real app, we would process the payment through a payment gateway
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push("/dashboard/payments/success");
        } catch (error) {
            console.error("Payment error:", error);
            setLoading(false);
        }
    };

    const getAmountTotal = () => {
        const rentAmount = parseFloat(amount);
        const utilitiesAmount = includeUtilities ? 75 : 0;
        return (rentAmount + utilitiesAmount).toFixed(2);
    };

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard/payments">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Payments
                </Link>
            </Button>

            <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>
                            Select the property and amount you want to pay
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="property">Property</Label>
                            <Select defaultValue="oak-apartment">
                                <SelectTrigger id="property">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="oak-apartment">
                                        <div className="flex items-center">
                                            <Building className="mr-2 h-4 w-4" />
                                            <span>Oak Apartment 2B</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment-amount">Payment Amount</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="payment-amount"
                                    type="text"
                                    className="pl-9"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Monthly rent: $1,250.00 (Due on Nov 1, 2023)
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="include-utilities"
                                checked={includeUtilities}
                                onCheckedChange={setIncludeUtilities}
                            />
                            <Label htmlFor="include-utilities">
                                Include utilities payment ($75.00)
                            </Label>
                        </div>

                        <Separator />

                        <div className="bg-secondary/50 p-4 rounded-md">
                            <div className="flex justify-between mb-2">
                                <span>Rent:</span>
                                <span>${parseFloat(amount).toFixed(2)}</span>
                            </div>
                            {includeUtilities && (
                                <div className="flex justify-between mb-2">
                                    <span>Utilities:</span>
                                    <span>$75.00</span>
                                </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${getAmountTotal()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>
                            Select how you want to pay
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={selectedPaymentId}
                            onValueChange={setSelectedPaymentId}
                            className="space-y-3"
                        >
                            {paymentMethods.map(method => (
                                <div
                                    key={method.id}
                                    className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer ${selectedPaymentId === method.id ? 'border-primary bg-primary/5' : ''
                                        }`}
                                    onClick={() => setSelectedPaymentId(method.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem value={method.id} id={method.id} />
                                        {method.type === 'card' ? (
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {method.brand} •••• {method.last4}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Expires {method.expMonth}/{method.expYear}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Building className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {method.bankName} •••• {method.last4}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {method.accountType.charAt(0).toUpperCase() +
                                                            method.accountType.slice(1)} Account
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {method.default && (
                                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                            Default
                                        </span>
                                    )}
                                </div>
                            ))}

                            <div
                                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer ${selectedPaymentId === 'new' ? 'border-primary bg-primary/5' : ''
                                    }`}
                                onClick={() => setSelectedPaymentId('new')}
                            >
                                <div className="flex items-center gap-4">
                                    <RadioGroupItem value="new" id="new" />
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-5 w-5 text-muted-foreground" />
                                        <p className="font-medium">Add New Payment Method</p>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>

                        {selectedPaymentId === 'new' && (
                            <div className="mt-4 border rounded-lg p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="payment-type">Payment Type</Label>
                                    <Select defaultValue="card">
                                        <SelectTrigger id="payment-type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                                            <SelectItem value="bank">Bank Account (ACH)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Card fields would go here */}
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cardholder">Cardholder Name</Label>
                                    <Input id="cardholder" placeholder="John Doe" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="save-payment"
                                        checked={savePaymentMethod}
                                        onCheckedChange={setSavePaymentMethod}
                                    />
                                    <Label htmlFor="save-payment">
                                        Save this payment method for future use
                                    </Label>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2 w-full">
                            <Checkbox
                                id="enable-autopay"
                                checked={autoPayEnabled}
                                onCheckedChange={setAutoPayEnabled}
                            />
                            <Label htmlFor="enable-autopay">
                                Enable autopay for future rent payments
                            </Label>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                            <Button variant="outline" asChild className="sm:w-auto w-full">
                                <Link href="/dashboard/payments">Cancel</Link>
                            </Button>
                            <Button
                                onClick={handlePayment}
                                disabled={loading}
                                className="sm:w-auto w-full"
                            >
                                {loading ? (
                                    "Processing..."
                                ) : (
                                    <>Pay ${getAmountTotal()} Now</>
                                )}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 