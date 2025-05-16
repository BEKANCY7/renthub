"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building, Calendar, CreditCard, CheckCircle2, Smartphone, Landmark, BanknoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function PayRentPage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("telebirr");
    const [amount, setAmount] = useState("25000");
    const [loading, setLoading] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    // Mock properties the user might have rented
    const properties = [
        {
            id: "prop1",
            name: "Modern Apartment in Bole",
            address: "Bole Road, Addis Ababa",
            rent: 25000
        }
    ];

    // Ethiopian payment methods
    const paymentMethods = [
        {
            id: "telebirr",
            name: "TeleBirr",
            description: "Pay using your TeleBirr mobile money account",
            icon: Smartphone
        },
        {
            id: "cbe",
            name: "Commercial Bank of Ethiopia",
            description: "Pay using CBE bank transfer",
            icon: Landmark
        },
        {
            id: "cash",
            name: "Cash",
            description: "Pay with cash on your next visit",
            icon: BanknoteIcon
        },
        {
            id: "card",
            name: "Debit/Credit Card",
            description: "Pay with Visa or Mastercard",
            icon: CreditCard
        }
    ];

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value);
        setPaymentStep(1);
    };

    const handlePayment = async () => {
        if (paymentMethod === "telebirr" && paymentStep === 1) {
            if (!phoneNumber || phoneNumber.length < 10) {
                toast.error("Please enter a valid phone number");
                return;
            }

            setLoading(true);

            // Simulate API call to TeleBirr
            await new Promise(resolve => setTimeout(resolve, 1500));

            setPaymentStep(2);
            setLoading(false);
            toast.success("Verification code sent to your phone");
            return;
        }

        if (paymentMethod === "telebirr" && paymentStep === 2) {
            if (!verificationCode || verificationCode.length < 4) {
                toast.error("Please enter the verification code");
                return;
            }

            setLoading(true);

            // Simulate API call to verify code
            await new Promise(resolve => setTimeout(resolve, 1500));

            completePayment();
            return;
        }

        setLoading(true);

        // Simulate API call for other payment methods
        await new Promise(resolve => setTimeout(resolve, 1500));

        completePayment();
    };

    const completePayment = () => {
        toast.success("Payment successful!");
        router.push("/dashboard/payments/success?amount=" + amount);
        setLoading(false);
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
                            <Select defaultValue="prop1">
                                <SelectTrigger id="property">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {properties.map(property => (
                                        <SelectItem key={property.id} value={property.id}>
                                            <div className="flex items-center">
                                                <Building className="mr-2 h-4 w-4" />
                                                <span>{property.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentType">Payment Type</Label>
                            <Select defaultValue="rent">
                                <SelectTrigger id="paymentType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rent">Monthly Rent</SelectItem>
                                    <SelectItem value="utilities">Utilities</SelectItem>
                                    <SelectItem value="deposit">Security Deposit</SelectItem>
                                    <SelectItem value="custom">Custom Amount</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (ETB)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">November 1, 2023</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>
                            Select your preferred payment method
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={handlePaymentMethodChange}
                            defaultValue="telebirr"
                        >
                            <div className="grid gap-4">
                                {paymentMethods.map(method => (
                                    <div key={method.id}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={method.id} id={method.id} />
                                            <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                                                <method.icon className="mr-2 h-5 w-5" />
                                                <div>
                                                    <div className="font-medium">{method.name}</div>
                                                    <div className="text-xs text-muted-foreground">{method.description}</div>
                                                </div>
                                            </Label>
                                        </div>
                                        {paymentMethod === method.id && method.id === "telebirr" && (
                                            <div className="ml-6 mt-3 pl-2 border-l-2 border-primary">
                                                {paymentStep === 1 ? (
                                                    <div className="space-y-3">
                                                        <Label htmlFor="phoneNumber">TeleBirr Account Phone Number</Label>
                                                        <Input
                                                            id="phoneNumber"
                                                            placeholder="+251 9xxxxxxxx"
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            We'll send a secure payment request to this number
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <Label htmlFor="verificationCode">Enter the 6-digit code sent to {phoneNumber}</Label>
                                                        <Input
                                                            id="verificationCode"
                                                            placeholder="******"
                                                            value={verificationCode}
                                                            onChange={(e) => setVerificationCode(e.target.value)}
                                                            maxLength={6}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button
                                                                variant="link"
                                                                className="p-0 h-auto"
                                                                onClick={() => setPaymentStep(1)}
                                                            >
                                                                Change phone number
                                                            </Button>
                                                            <Button
                                                                variant="link"
                                                                className="p-0 h-auto"
                                                                onClick={() => toast.success("Code resent to your phone")}
                                                            >
                                                                Resend code
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {paymentMethod === method.id && method.id === "cbe" && (
                                            <div className="ml-6 mt-3 pl-2 border-l-2 border-primary">
                                                <p className="text-sm">
                                                    Transfer to account: <span className="font-medium">1000123456789</span>
                                                </p>
                                                <p className="text-sm">
                                                    Bank: Commercial Bank of Ethiopia
                                                </p>
                                                <p className="text-sm">
                                                    Account Name: RentHub Ethiopia
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Please include your property ID (prop1) as reference
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Property</span>
                                <span className="font-medium">{properties[0].name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Type</span>
                                <span className="font-medium">Monthly Rent</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-medium">
                                    {paymentMethod ? paymentMethods.find(m => m.id === paymentMethod)?.name : "Not selected"}
                                </span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between">
                                <span className="font-medium">Total</span>
                                <span className="font-bold">ETB {parseInt(amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            disabled={!paymentMethod || loading}
                            onClick={handlePayment}
                        >
                            {loading ? "Processing..." : "Complete Payment"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 