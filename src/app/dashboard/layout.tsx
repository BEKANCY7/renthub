import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import ClientDashboardLayout from "@/components/dashboard/ClientDashboardLayout";

export const metadata: Metadata = {
  title: "RentHub Dashboard",
  description: "Manage your rental listings and bookings",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <ClientDashboardLayout user={session.user}>
      {children}
    </ClientDashboardLayout>
  );
}
