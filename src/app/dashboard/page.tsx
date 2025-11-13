"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDashboard from "@/components/dashboard/UserDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const isOwner = user.role === "OWNER" || user.role === "ADMIN";

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
          <UserDashboard userId={user.id} />
        </TabsContent>
        {isOwner && (
          <TabsContent value="owner" className="space-y-4">
            <OwnerDashboard userId={user.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
