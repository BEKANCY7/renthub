"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import {
  Home,
  List,
  Calendar,
  CreditCard,
  MessageSquare,
  PieChart,
  Settings,
  User,
  Plus,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MessageNotifications from "@/components/MessageNotifications";

interface SidebarProps {
  user: Session["user"];
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  user,
  isMobileOpen = false,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const isOwner = user.role === "OWNER" || user.role === "ADMIN";
  const isAdmin = user.role === "ADMIN";

  // Handle closing sidebar when navigating on mobile
  useEffect(() => {
    if (setIsMobileOpen && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [pathname, setIsMobileOpen, isMobileOpen]);

  const commonLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      notification: true,
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ];

  const renterLinks = [
    {
      name: "Find Home",
      href: "/find-home",
      icon: Search,
    },
  ];

  const ownerLinks = [
    {
      name: "My Listings",
      href: "/dashboard/listings",
      icon: List,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: PieChart,
    },
  ];

  const adminLinks = [
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const navLinks = [
    ...commonLinks,
    ...(isOwner ? ownerLinks : renterLinks),
    ...(isAdmin ? adminLinks : []),
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link
            href="/dashboard"
            className="flex items-center font-bold text-xl"
          >
            RentHub
          </Link>
          {/* Mobile close button */}
          {setIsMobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
                    pathname === link.href ? "bg-gray-100" : "transparent"
                  )}
                >
                  <link.icon className="mr-3 h-4 w-4" />
                  <span className="flex-1">{link.name}</span>
                  {link.notification && (
                    <MessageNotifications context="sidebar" />
                  )}
                </span>
              </Link>
            ))}
            {isOwner && (
              <Link href="/dashboard/listings/new">
                <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
                  <Plus className="mr-3 h-4 w-4" />
                  Add Listing
                </span>
              </Link>
            )}
          </nav>
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600">
                  {user.name?.[0] || "U"}
                </div>
              )}
            </div>
            <div className="grid gap-0.5">
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-xs text-gray-500 truncate max-w-[160px]">
                {user.email}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
