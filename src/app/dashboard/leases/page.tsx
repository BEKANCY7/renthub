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
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Calendar,
    Search,
    FileText,
    MoreVertical,
    Home,
    Clock,
    Bell,
    CheckCircle2,
    Users,
    AlertTriangle,
    Plus,
    Download,
    Send,
    Filter,
    RefreshCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Helper to calculate the days remaining in a lease
const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Helper to get the lease status badge
const getLeaseStatusBadge = (endDate) => {
    const daysRemaining = getDaysRemaining(endDate);

    if (daysRemaining < 0) {
        return (
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Expired
            </Badge>
        );
    } else if (daysRemaining <= 30) {
        return (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                <Clock className="mr-1 h-3 w-3" />
                Expiring Soon
            </Badge>
        );
    } else {
        return (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Active
            </Badge>
        );
    }
};

const getRenewalStatusBadge = (status) => {
    switch (status) {
        case "renewed":
            return (
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Renewed
                </Badge>
            );
        case "pending":
            return (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                </Badge>
            );
        case "notStarted":
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    Not Started
                </Badge>
            );
        default:
            return null;
    }
};

// Mock data for leases
const leases = [
    {
        id: "LS-1001",
        property: "Oak Apartment 2B",
        tenant: "John Doe",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        monthlyRent: 1250,
        securityDeposit: 1250,
        renewalStatus: "notStarted",
        paymentStatus: "current",
    },
    {
        id: "LS-1002",
        property: "Pine Townhouse 5A",
        tenant: "Jane Smith",
        startDate: "2023-03-15",
        endDate: "2023-12-15",
        monthlyRent: 1450,
        securityDeposit: 1450,
        renewalStatus: "pending",
        paymentStatus: "current",
    },
    {
        id: "LS-1003",
        property: "Maple Condo 12C",
        tenant: "Michael Johnson",
        startDate: "2022-11-01",
        endDate: "2023-11-01",
        monthlyRent: 1800,
        securityDeposit: 1800,
        renewalStatus: "renewed",
        paymentStatus: "current",
    },
    {
        id: "LS-1004",
        property: "Birch House 23",
        tenant: "Emily Williams",
        startDate: "2022-10-01",
        endDate: "2023-10-01",
        monthlyRent: 2200,
        securityDeposit: 2200,
        renewalStatus: "notStarted",
        paymentStatus: "late",
    },
];

// Mock data for upcoming renewals
const upcomingRenewals = leases
    .filter(lease => {
        const daysRemaining = getDaysRemaining(lease.endDate);
        return daysRemaining > 0 && daysRemaining <= 90;
    })
    .sort((a, b) => {
        return new Date(a.endDate) - new Date(b.endDate);
    });

export default function LeasesPage() {
    const [currentTab, setCurrentTab] = useState("active");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter leases based on current tab and search query
    const filteredLeases = () => {
        let filtered = [...leases];

        // Filter by tab
        if (currentTab === "active") {
            filtered = filtered.filter(lease => getDaysRemaining(lease.endDate) > 0);
        } else if (currentTab === "expiring") {
            filtered = filtered.filter(lease => {
                const days = getDaysRemaining(lease.endDate);
                return days > 0 && days <= 30;
            });
        } else if (currentTab === "expired") {
            filtered = filtered.filter(lease => getDaysRemaining(lease.endDate) <= 0);
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                lease =>
                    lease.property.toLowerCase().includes(query) ||
                    lease.tenant.toLowerCase().includes(query) ||
                    lease.id.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lease Management</h1>
                    <p className="text-muted-foreground">
                        Monitor active leases, upcoming renewals, and expirations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/dashboard/leases/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Lease
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Leases
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leases.filter(lease => getDaysRemaining(lease.endDate) > 0).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total active lease agreements
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Expiring Soon
                        </CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leases.filter(lease => {
                                const days = getDaysRemaining(lease.endDate);
                                return days > 0 && days <= 30;
                            }).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Leases expiring within 30 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Renewal Rate
                        </CardTitle>
                        <RefreshCw className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">75%</div>
                        <p className="text-xs text-muted-foreground">
                            Last 12 months renewal rate
                        </p>
                        <Progress value={75} className="mt-2 h-1" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Tenants
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leases.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Current rental occupants
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <Card className="md:w-2/3">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <CardTitle>Lease Agreements</CardTitle>
                                <CardDescription>
                                    Manage your current and expired lease agreements
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search leases..."
                                        className="pl-8 w-full sm:w-[200px]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                            <span className="sr-only">Filter</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Start Date
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            End Date
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Home className="mr-2 h-4 w-4" />
                                            Property
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            <div className="px-6">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="active">Active</TabsTrigger>
                                    <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
                                    <TabsTrigger value="expired">Expired</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value={currentTab} className="mt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lease ID</TableHead>
                                            <TableHead>Property</TableHead>
                                            <TableHead>Tenant</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLeases().length > 0 ? (
                                            filteredLeases().map((lease) => (
                                                <TableRow key={lease.id}>
                                                    <TableCell className="font-medium">{lease.id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Home className="h-4 w-4 text-muted-foreground" />
                                                            {lease.property}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{lease.tenant}</TableCell>
                                                    <TableCell>{new Date(lease.endDate).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        {getLeaseStatusBadge(lease.endDate)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link href={`/dashboard/leases/${lease.id}`}>
                                                                    <FileText className="h-4 w-4 mr-1" />
                                                                    View
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
                                                                    <DropdownMenuItem>
                                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                                        Renew Lease
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Send className="mr-2 h-4 w-4" />
                                                                        Contact Tenant
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="rounded-full bg-muted p-3 mb-3">
                                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                        <h3 className="font-medium">No leases found</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {searchQuery
                                                                ? `No results for "${searchQuery}"`
                                                                : "There are no leases matching the current filters"}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                {filteredLeases().length > 0 && (
                                    <div className="px-6 py-4">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious href="#" />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink href="#" isActive>1</PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink href="#">2</PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink href="#">3</PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationNext href="#" />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card className="md:w-1/3">
                    <CardHeader>
                        <CardTitle>Upcoming Renewals</CardTitle>
                        <CardDescription>
                            Leases expiring in the next 90 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingRenewals.length > 0 ? (
                            upcomingRenewals.map((lease) => {
                                const daysRemaining = getDaysRemaining(lease.endDate);
                                return (
                                    <div
                                        key={lease.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium">{lease.property}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {lease.tenant}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    Expires on {new Date(lease.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge
                                                variant="outline"
                                                className={`
                          ${daysRemaining <= 30
                                                        ? "bg-red-100 text-red-800"
                                                        : daysRemaining <= 60
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-blue-100 text-blue-800"}
                        `}
                                            >
                                                {daysRemaining} days left
                                            </Badge>
                                            {getRenewalStatusBadge(lease.renewalStatus)}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="rounded-full bg-muted p-3 mb-3">
                                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="font-medium">No upcoming renewals</h3>
                                <p className="text-sm text-muted-foreground text-center mt-1">
                                    All of your leases are up to date.
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/leases/schedule">
                                <Bell className="mr-2 h-4 w-4" />
                                Set Renewal Reminders
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 