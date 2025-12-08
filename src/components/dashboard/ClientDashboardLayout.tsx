"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

// Client component to handle state
export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, isLoading } = useAuth();

  // Create a default user if none exists
  const displayUser = user || {
    id: "demo-user",
    email: "demo@renthub.com",
    name: "Demo User",
    role: "OWNER",
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        user={displayUser}
        isMobileOpen={mobileNavOpen}
        setIsMobileOpen={setMobileNavOpen}
      />
      <div className="flex flex-col flex-1 w-full">
        <Header user={displayUser} setMobileNavOpen={setMobileNavOpen} />
        <main className="flex-1 overflow-y-auto p-4 pt-[calc(4rem+1rem)] md:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
