import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

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
        <div className="flex h-screen overflow-hidden">
            <Sidebar user={session.user} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header user={session.user} />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
} 