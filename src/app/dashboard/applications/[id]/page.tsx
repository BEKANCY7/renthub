"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
    ArrowLeft,
    User,
    Home,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    DollarSign,
    Briefcase,
    Phone,
    Mail,
    AlertTriangle,
    FileText,
    Shield,
    Star,
} from "lucide-react";

// Mock data - in a real app, you would fetch this from your API
const applicationData = {
    id: "APP-1234",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    property: "Oak Apartment 2B",
    rent: 1250,
    dateApplied: "2023-10-25",
    moveInDate: "2023-12-01",
    status: "pending",
    creditScore: 720,
    income: "$5,000/month",
    backgroundCheck: "Clear",
    evictionHistory: "None",
    personalInfo: {
        dob: "1985-06-15",
        ssn: "XXX-XX-1234",
        currentAddress: "123 Current St, Anytown, CA 90210",
        lengthOfStay: "3 years",
        reasonForMoving: "Relocating for work",
    },
    employment: {
        employer: "Acme Corporation",
        position: "Software Engineer",
        supervisorName: "Jane Smith",
        supervisorPhone: "(555) 123-4567",
        employmentLength: "4 years",
        monthlyIncome: 5000,
    },
    references: [
        {
            name: "Michael Johnson",
            relationship: "Previous Landlord",
            phone: "(555) 987-6543",
            email: "michael@example.com",
        },
        {
            name: "Emily Williams",
            relationship: "Colleague",
            phone: "(555) 876-5432",
            email: "emily@example.com",
        },
    ],
    documents: [
        {
            name: "Pay Stubs.pdf",
            type: "Income Verification",
            dateUploaded: "2023-10-25",
        },
        {
            name: "ID Document.pdf",
            type: "Identification",
            dateUploaded: "2023-10-25",
        },
        {
            name: "Rental History.pdf",
            type: "Rental History",
            dateUploaded: "2023-10-25",
        },
    ],
};

const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Pending Review
                </Badge>
            );
        case "inProgress":
            return (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    In Progress
                </Badge>
            );
        case "approved":
            return (
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Approved
                </Badge>
            );
        case "denied":
            return (
                <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center">
                    <XCircle className="mr-1 h-4 w-4" />
                    Denied
                </Badge>
            );
        default:
            return null;
    }
};

export default function ApplicationDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [currentTab, setCurrentTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [reviewNotes, setReviewNotes] = useState("");

    // In a real app, you would fetch the application data based on the ID
    // For demo purposes, we'll use the mock data
    const application = applicationData;

    const handleApprove = async () => {
        setLoading(true);
        try {
            // Here you would make an API call to approve the application
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push("/dashboard/applications?approved=true");
        } catch (error) {
            console.error("Error approving application:", error);
            setLoading(false);
        }
    };

    const handleDeny = async () => {
        setLoading(true);
        try {
            // Here you would make an API call to deny the application
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push("/dashboard/applications?denied=true");
        } catch (error) {
            console.error("Error denying application:", error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/applications">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Application #{id}</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">
                                Submitted on {new Date(application.dateApplied).toLocaleDateString()}
                            </p>
                            {getStatusBadge(application.status)}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/applications/${id}/pdf`}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Deny
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deny Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to deny this application? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeny}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {loading ? "Processing..." : "Deny Application"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Approve Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to approve this application? The applicant will be notified and the lease process will begin.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleApprove}
                                >
                                    {loading ? "Processing..." : "Approve Application"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle>Applicant Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{application.name}</h2>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Mail className="mr-1 h-3 w-3" />
                                        {application.email}
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="mr-1 h-3 w-3" />
                                        {application.phone}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="background">Background</TabsTrigger>
                                <TabsTrigger value="references">References</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                                            <div className="font-medium">{new Date(application.personalInfo.dob).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Current Address</h3>
                                            <div className="font-medium">{application.personalInfo.currentAddress}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Length of Stay</h3>
                                            <div className="font-medium">{application.personalInfo.lengthOfStay}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">SSN (Last 4)</h3>
                                            <div className="font-medium">{application.personalInfo.ssn}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Reason for Moving</h3>
                                            <div className="font-medium">{application.personalInfo.reasonForMoving}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Desired Move-in Date</h3>
                                            <div className="font-medium">{new Date(application.moveInDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Employment Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Employer</h3>
                                                <div className="font-medium">{application.employment.employer}</div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                                                <div className="font-medium">{application.employment.position}</div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Monthly Income</h3>
                                                <div className="font-medium">${application.employment.monthlyIncome.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Supervisor</h3>
                                                <div className="font-medium">{application.employment.supervisorName}</div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Supervisor Phone</h3>
                                                <div className="font-medium">{application.employment.supervisorPhone}</div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Length of Employment</h3>
                                                <div className="font-medium">{application.employment.employmentLength}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="background" className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader className="py-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Credit Check</CardTitle>
                                                <Star className="h-5 w-5 text-yellow-500" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-4xl font-bold mb-2">{application.creditScore}</div>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Good</Badge>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Credit score meets required minimum of 650
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="py-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Income Verification</CardTitle>
                                                <DollarSign className="h-5 w-5 text-green-500" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-4xl font-bold mb-2">4x</div>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Income is 4x the monthly rent of ${application.rent}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="py-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Background Check</CardTitle>
                                                <Shield className="h-5 w-5 text-green-500" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-xl font-bold mb-2">{application.backgroundCheck}</div>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    No criminal history found
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="py-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Rental History</CardTitle>
                                                <Home className="h-5 w-5 text-green-500" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-xl font-bold mb-2">{application.evictionHistory}</div>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Clear</Badge>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    No evictions or late payments reported
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="references" className="mt-4">
                                <div className="space-y-4">
                                    {application.references.map((reference, index) => (
                                        <Card key={index}>
                                            <CardHeader className="py-3">
                                                <CardTitle>{reference.name}</CardTitle>
                                                <CardDescription>{reference.relationship}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid grid-cols-2 gap-4 py-2">
                                                <div>
                                                    <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                                                    <div className="font-medium">{reference.phone}</div>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                                    <div className="font-medium">{reference.email}</div>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button variant="outline" size="sm">
                                                    <Phone className="mr-2 h-4 w-4" />
                                                    Contact Reference
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="documents" className="mt-4">
                                <div className="space-y-4">
                                    {application.documents.map((document, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-secondary rounded-full p-2">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{document.name}</div>
                                                    <div className="text-sm text-muted-foreground">{document.type}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm text-muted-foreground">
                                                    Uploaded on {new Date(document.dateUploaded).toLocaleDateString()}
                                                </div>
                                                <Button variant="outline" size="sm">View</Button>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary rounded-full p-2">
                                    <Home className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">{application.property}</div>
                                    <div className="text-sm text-muted-foreground">2 Bed, 2 Bath</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Monthly Rent:</span>
                                    <span className="font-medium">${application.rent}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Security Deposit:</span>
                                    <span className="font-medium">${application.rent}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Requested Move-in:</span>
                                    <span className="font-medium">{new Date(application.moveInDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Income to Rent Ratio:</span>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">4:1</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Review Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Add notes about this application..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                rows={6}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Save Notes</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Application Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="w-0.5 h-12 bg-muted" />
                                </div>
                                <div>
                                    <div className="font-medium">Application Submitted</div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(application.dateApplied).toLocaleDateString()} at 2:34 PM
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="w-0.5 h-12 bg-muted" />
                                </div>
                                <div>
                                    <div className="font-medium">Background Check Initiated</div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(application.dateApplied).toLocaleDateString()} at 3:15 PM
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="w-0.5 h-12 bg-muted" />
                                </div>
                                <div>
                                    <div className="font-medium">Credit Check Completed</div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(application.dateApplied).toLocaleDateString()} at 4:22 PM
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium">Pending Review</div>
                                    <div className="text-sm text-muted-foreground">
                                        Awaiting final decision
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 