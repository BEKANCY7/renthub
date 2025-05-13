import { Suspense } from "react";
import Link from "next/link";
import { Home, DollarSign, Users, TrendingUp, Plus } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { RecentListings } from "@/components/dashboard/RecentListings";
import { RecentRequests } from "@/components/dashboard/RecentRequests";

interface OwnerDashboardProps {
    userId: string;
}

export default function OwnerDashboard({ userId }: OwnerDashboardProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">
                        +1 from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$4,350</div>
                    <p className="text-xs text-muted-foreground">
                        +12% from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Renters</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">
                        5 active bookings
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">
                        +5% from last month
                    </p>
                </CardContent>
            </Card>
            <Card className="col-span-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Income Overview</CardTitle>
                        <CardDescription>
                            Your earnings over the past 6 months
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            Monthly
                        </Button>
                        <Button variant="outline" size="sm">
                            Yearly
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="h-80">
                    <Suspense fallback={<div>Loading chart...</div>}>
                        <IncomeChart userId={userId} />
                    </Suspense>
                </CardContent>
            </Card>
            <Card className="col-span-full md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Listings</CardTitle>
                        <CardDescription>
                            Manage your rental properties
                        </CardDescription>
                    </div>
                    <Button size="sm" asChild>
                        <Link href="/dashboard/listings/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading listings...</div>}>
                        <RecentListings userId={userId} />
                    </Suspense>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/dashboard/listings">View All Listings</Link>
                    </Button>
                </CardFooter>
            </Card>
            <Card className="col-span-full md:col-span-2">
                <CardHeader>
                    <CardTitle>Booking Requests</CardTitle>
                    <CardDescription>
                        Recent rental requests requiring your attention
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading requests...</div>}>
                        <RecentRequests userId={userId} />
                    </Suspense>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/dashboard/bookings">View All Requests</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 