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
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    User,
    Home,
    Calendar,
    MoreVertical,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    Star,
    Filter,
    FolderOpen,
    SlidersHorizontal,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Review
                </Badge>
            );
        case "inProgress":
            return (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Clock className="mr-1 h-3 w-3" />
                    In Progress
                </Badge>
            );
        case "approved":
            return (
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Approved
                </Badge>
            );
        case "denied":
            return (
                <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                    <XCircle className="mr-1 h-3 w-3" />
                    Denied
                </Badge>
            );
        default:
            return null;
    }
};

// Mock data for applications
const applications = [
    {
        id: "APP-1234",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(123) 456-7890",
        property: "Oak Apartment 2B",
        dateApplied: "2023-10-25",
        moveInDate: "2023-12-01",
        status: "pending",
        creditScore: 720,
        income: "$5,000/month",
        backgroundCheck: "Clear",
        evictionHistory: "None",
    },
    {
        id: "APP-1235",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "(123) 456-7891",
        property: "Pine Townhouse 5A",
        dateApplied: "2023-10-22",
        moveInDate: "2023-11-15",
        status: "inProgress",
        creditScore: 680,
        income: "$4,200/month",
        backgroundCheck: "Clear",
        evictionHistory: "None",
    },
    {
        id: "APP-1236",
        name: "Michael Johnson",
        email: "michael.j@example.com",
        phone: "(123) 456-7892",
        property: "Maple Condo 12C",
        dateApplied: "2023-10-18",
        moveInDate: "2023-11-01",
        status: "approved",
        creditScore: 750,
        income: "$6,500/month",
        backgroundCheck: "Clear",
        evictionHistory: "None",
    },
    {
        id: "APP-1237",
        name: "Emily Williams",
        email: "emily.w@example.com",
        phone: "(123) 456-7893",
        property: "Birch House 23",
        dateApplied: "2023-10-15",
        moveInDate: "2023-12-15",
        status: "denied",
        creditScore: 580,
        income: "$3,200/month",
        backgroundCheck: "Issues Found",
        evictionHistory: "Previous Eviction",
    },
];

export default function ApplicationsPage() {
    const [currentTab, setCurrentTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredApplications = () => {
        let filtered = [...applications];

        // Filter by status tab
        if (currentTab !== "all") {
            filtered = filtered.filter(app => app.status === currentTab);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                app =>
                    app.name.toLowerCase().includes(query) ||
                    app.email.toLowerCase().includes(query) ||
                    app.property.toLowerCase().includes(query) ||
                    app.id.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rental Applications</h1>
                    <p className="text-muted-foreground">
                        Review and manage tenant applications for your properties
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search applications..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="sr-only">Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Date Applied
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Home className="mr-2 h-4 w-4" />
                                Property
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Star className="mr-2 h-4 w-4" />
                                Credit Score
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All Applications</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Date Applied</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredApplications().length > 0 ? (
                                        filteredApplications().map((application) => (
                                            <TableRow key={application.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-secondary rounded-full p-2">
                                                            <User className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{application.name}</div>
                                                            <div className="text-sm text-muted-foreground">{application.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{application.property}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Move-in: {new Date(application.moveInDate).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(application.dateApplied).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(application.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/dashboard/applications/${application.id}`}>
                                                                <FolderOpen className="h-4 w-4 mr-1" />
                                                                Review
                                                            </Link>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                    <span className="sr-only">More</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    Download PDF
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                    Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600">
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Deny
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="rounded-full bg-secondary p-3 mb-3">
                                                        <Filter className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="font-medium mb-1">No applications found</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        {searchQuery
                                                            ? `No results for "${searchQuery}"`
                                                            : "There are no applications with the selected filters"}
                                                    </p>
                                                    {searchQuery && (
                                                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                                                            Clear Search
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </Tabs>
        </div>
    );
} 