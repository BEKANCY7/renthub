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

  // Create a default user for demo mode
  const displayUser = user || {
    id: "demo-user-123",
    email: "demo@renthub.com",
    name: "Demo User",
    role: "OWNER",
  };

  console.log("Dashboard - isLoading:", isLoading);
  console.log("Dashboard - user:", displayUser);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  console.log("Dashboard - Rendering main content");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {displayUser.name || displayUser.email}!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
          <p className="text-sm text-blue-800">
            🎨 <strong>Demo Mode:</strong> All data shown is mock data for
            demonstration purposes. You can access the dashboard directly
            without login.
          </p>
        </div>
      </div>
      <Tabs defaultValue="renter" className="space-y-4">
        <TabsList>
          <TabsTrigger value="renter">Renter View</TabsTrigger>
          <TabsTrigger value="owner">Owner View</TabsTrigger>
        </TabsList>
        <TabsContent value="renter" className="space-y-4">
          <UserDashboard userId={displayUser.id} />
        </TabsContent>
        <TabsContent value="owner" className="space-y-4">
          <OwnerDashboard userId={displayUser.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
