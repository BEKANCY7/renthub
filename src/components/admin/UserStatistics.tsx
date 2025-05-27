"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, UserCog } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  adminUsers: number;
  owners: number;
  renters: number;
  recentSignups: number;
}

export function UserStatistics() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/users/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch user statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-muted rounded" />
            ) : (
              stats?.totalUsers || 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-24 animate-pulse bg-muted rounded mt-1" />
            ) : (
              `+${stats?.recentSignups || 0} in the last 30 days`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-muted rounded" />
            ) : (
              stats?.activeUsers || 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-24 animate-pulse bg-muted rounded mt-1" />
            ) : (
              `${Math.round(
                ((stats?.activeUsers || 0) / (stats?.totalUsers || 1)) * 100
              )}% of total users`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Property Owners</CardTitle>
          <UserCog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-muted rounded" />
            ) : (
              stats?.owners || 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-24 animate-pulse bg-muted rounded mt-1" />
            ) : (
              `${Math.round(
                ((stats?.owners || 0) / (stats?.totalUsers || 1)) * 100
              )}% of total users`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suspended Users</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-muted rounded" />
            ) : (
              stats?.suspendedUsers || 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-24 animate-pulse bg-muted rounded mt-1" />
            ) : (
              `${Math.round(
                ((stats?.suspendedUsers || 0) / (stats?.totalUsers || 1)) * 100
              )}% of total users`
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
