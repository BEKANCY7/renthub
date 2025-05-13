import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDashboard from "@/components/dashboard/UserDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    const isOwner = session.user.role === "OWNER" || session.user.role === "ADMIN";

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <Tabs defaultValue={isOwner ? "owner" : "renter"} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="renter">Renter</TabsTrigger>
                    {isOwner && <TabsTrigger value="owner">Owner</TabsTrigger>}
                </TabsList>
                <TabsContent value="renter" className="space-y-4">
                    <UserDashboard userId={session.user.id} />
                </TabsContent>
                {isOwner && (
                    <TabsContent value="owner" className="space-y-4">
                        <OwnerDashboard userId={session.user.id} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
} 