"use client";

interface MessageNotificationsProps {
  context?: "navbar" | "sidebar";
}

export default function MessageNotifications({
  context = "navbar",
}: MessageNotificationsProps) {
  // Always return null to remove the component from the application
  return null;
}
