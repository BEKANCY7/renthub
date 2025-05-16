"use client";

import Link from "next/link";
import { CheckCircle2, Home, Calendar, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplicationSuccessPage() {
    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold">Application Submitted Successfully!</h1>
                <p className="text-muted-foreground mt-2">
                    Your rental application has been received and is now being processed.
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>What Happens Next?</CardTitle>
                    <CardDescription>
                        Here's what you can expect in the coming days
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Application Review</h3>
                                <p className="text-sm text-muted-foreground">
                                    The property manager will review your application within 48 hours and verify the information provided.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                                <MessageSquare className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Landlord Communication</h3>
                                <p className="text-sm text-muted-foreground">
                                    You'll receive a message from the landlord through RentHub once your application has been reviewed.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                                <Home className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Lease Agreement</h3>
                                <p className="text-sm text-muted-foreground">
                                    If approved, you'll receive the lease agreement for review and digital signing.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Move-in Coordination</h3>
                                <p className="text-sm text-muted-foreground">
                                    After signing the lease, the landlord will coordinate with you to schedule the move-in date and key handover.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>
                        A copy of your application has been sent to your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Application ID:</span>
                            <p className="font-medium">APP-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Date Submitted:</span>
                            <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Property:</span>
                            <p className="font-medium">2 Bedroom Apartment</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Status:</span>
                            <p className="font-medium">
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                    Under Review
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild variant="outline">
                    <Link href="/dashboard">
                        Go to Dashboard
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/search">
                        Continue Browsing
                    </Link>
                </Button>
            </div>
        </div>
    );
} 