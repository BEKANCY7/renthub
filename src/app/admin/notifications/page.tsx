// TODO: Connect to your external backend API
// import { authenticatedFetch } from "@/lib/api";

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Notifications - RentHub Admin",
  description: "Manage system notifications and alerts",
};

async function getNotifications() {
  // TODO: Fetch from your backend API
  // const response = await authenticatedFetch('/admin/notifications');
  // return await response.json();

  // Mock notifications data
  const notifications = [
    {
      id: "1",
      title: "New User Registration",
      message: "A new user has registered on the platform",
      type: "USER",
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "New Listing Created",
      message: "A new property listing has been created and needs approval",
      type: "LISTING",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  return notifications;
}

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <Badge variant={notification.isRead ? "secondary" : "default"}>
                  {notification.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
