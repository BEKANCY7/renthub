"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Building2,
  Settings,
  CreditCard,
  MessageSquare,
  Bell,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Navigation items for the sidebar
const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Listings", href: "/admin/listings", icon: Building2 },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Messages", href: "/admin/messaging", icon: MessageSquare },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Check if a nav item is active based on the current path
  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") {
      return true;
    }
    return pathname.startsWith(href) && href !== "/admin";
  };

  // Sidebar navigation items
  const renderNavItems = () => (
    <nav className="flex flex-col space-y-1">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            isActive(item.href)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <item.icon className="mr-3 h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  );

  // Sign out button
  const renderSignOutButton = () => (
    <Button
      variant="ghost"
      className="w-full justify-start px-3 py-2 text-sm"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="mr-3 h-4 w-4" />
      Sign Out
    </Button>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className={cn("hidden lg:flex lg:flex-col w-64 h-screen", className)}>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex-1 px-3 py-6 space-y-6">
          <div className="flex items-center px-3">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          {renderNavItems()}
        </div>
        <div className="p-3 border-t">{renderSignOutButton()}</div>
      </div>
    </div>
  );

  // Mobile sidebar (sheet)
  const MobileSidebar = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="flex-1 px-3 py-6 overflow-y-auto">
            {renderNavItems()}
          </div>
          <div className="p-3 border-t">{renderSignOutButton()}</div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
