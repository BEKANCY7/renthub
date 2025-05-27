"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  CreditCard,
  Settings,
  BarChart,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/admin/UserNav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Listings",
      href: "/admin/listings",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link
              href="/admin/dashboard"
              className="text-xl font-bold text-primary"
            >
              RentHub Admin
            </Link>
          </div>
          <div className="mt-8 flex flex-col flex-1">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="text-lg font-bold text-primary"
        >
          RentHub Admin
        </Link>
        <div className="flex items-center gap-2">
          <UserNav />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-white pt-16">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Desktop header with user nav */}
        <div className="hidden md:flex md:h-16 md:items-center md:justify-end md:px-8 md:border-b">
          <UserNav />
        </div>
        
        <main className="flex-1 pt-16 md:pt-0">
          <div className="py-6 px-4 sm:px-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
