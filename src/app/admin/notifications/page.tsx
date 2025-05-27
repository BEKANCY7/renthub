import { Metadata } from "next";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Notifications - RentHub Admin",
  description: "Manage system notifications and alerts",
};

// This is a placeholder as we don't have a notifications model in the schema
// In a real application, you would fetch notifications from the database
async function getNotifications() {
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
    {
      id: "3",
      title: "Payment Received",
      message: "A payment of $1,200 has been processed successfully",
      type: "PAYMENT",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "4",
      title: "Booking Cancellation",
      message: "A user has cancelled their booking and requested a refund",
      type: "BOOKING",
      isRead: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "5",
      title: "System Alert",
      message: "Database backup completed successfully",
      type: "SYSTEM",
      isRead: true,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  return notifications;
}

export default async function AdminNotificationsPage() {
  const notifications = await getNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage system notifications and alerts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-md border ${
                  notification.isRead
                    ? "bg-white"
                    : "bg-blue-50 border-blue-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        notification.type === "SYSTEM"
                          ? "destructive"
                          : notification.type === "PAYMENT"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {notification.type}
                    </Badge>
                    <h3 className="font-medium">{notification.title}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm">{notification.message}</p>
                <div className="mt-3 flex justify-end">
                  <Button variant="ghost" size="sm">
                    {notification.isRead ? "Mark as Unread" : "Mark as Read"}
                  </Button>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No notifications found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Email Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Receive important notifications via email
                </p>
                <Button variant="secondary" size="sm">
                  Configure
                </Button>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">System Alerts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure system-level alerts and notifications
                </p>
                <Button variant="secondary" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
