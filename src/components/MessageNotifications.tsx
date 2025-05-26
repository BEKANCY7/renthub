"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Notification {
  id: string;
  conversationId: string;
  senderName: string;
  senderImage: string;
  message: string;
  timestamp: string;
}

interface MessageNotificationsProps {
  context?: "navbar" | "sidebar";
}

export default function MessageNotifications({
  context = "navbar",
}: MessageNotificationsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (status !== "authenticated") return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/messages/unread");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        // Transform the data into notifications format
        const notificationData = data.unreadMessages.map((msg: any) => ({
          id: msg.id,
          conversationId: msg.conversationId,
          senderName: msg.sender.name,
          senderImage: msg.sender.image || "",
          message: msg.content,
          timestamp: msg.createdAt,
        }));

        setNotifications(notificationData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadMessages();

    // Poll for new messages every 30 seconds
    const intervalId = setInterval(fetchUnreadMessages, 30000);

    return () => clearInterval(intervalId);
  }, [status]);

  // Handle notification click
  const handleNotificationClick = (conversationId: string) => {
    router.push(`/messages?conversation=${conversationId}`);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return isToday ? format(date, "h:mm a") : format(date, "MMM d");
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircle className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new messages
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-3 cursor-pointer"
                onClick={() =>
                  handleNotificationClick(notification.conversationId)
                }
              >
                <div className="flex items-start gap-3">
                  {notification.senderImage ? (
                    <img
                      src={notification.senderImage}
                      alt={notification.senderName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm truncate">
                        {notification.senderName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm truncate text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="p-2 cursor-pointer text-center"
              onClick={() => router.push("/messages")}
            >
              View all messages
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
