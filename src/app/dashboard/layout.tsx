import type { Metadata } from "next";
import ClientDashboardLayout from "@/components/dashboard/ClientDashboardLayout";

export const metadata: Metadata = {
  title: "RentHub Dashboard",
  description: "Manage your rental listings and bookings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is handled by middleware
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>;
}
