import { Suspense } from "react";
import { BookOpen, Calendar, Clock, MapPin } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { UpcomingBookings } from "@/components/dashboard/UpcomingBookings";
import { SearchForm } from "@/components/dashboard/SearchForm";

interface UserDashboardProps {
    userId: string;
}

export default function UserDashboard({ userId }: UserDashboardProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                        +2 from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">
                        Current active reservations
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                        In the next 30 days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Popular Locations</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">London</div>
                    <p className="text-xs text-muted-foreground">
                        Most booked destination
                    </p>
                </CardContent>
            </Card>
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Find Your Next Stay</CardTitle>
                    <CardDescription>
                        Search for houses, apartments, or other accommodations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SearchForm />
                </CardContent>
            </Card>
            <Card className="col-span-full md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>
                        Your scheduled trips for the next 30 days.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <UpcomingBookings userId={userId} />
                    </Suspense>
                </CardContent>
            </Card>
            <Card className="col-span-full md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>
                        Your booking history from the past 30 days.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <RecentBookings userId={userId} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
} 