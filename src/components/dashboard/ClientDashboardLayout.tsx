"use client";

import { useState } from "react";
import { Session } from "next-auth";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

// Client component to handle state
export default function ClientDashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Session["user"];
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        user={user}
        isMobileOpen={mobileNavOpen}
        setIsMobileOpen={setMobileNavOpen}
      />
      <div className="flex flex-col flex-1 w-full">
        <Header user={user} setMobileNavOpen={setMobileNavOpen} />
        <main className="flex-1 overflow-y-auto p-4 pt-[calc(4rem+1rem)] md:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
