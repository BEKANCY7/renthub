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
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    user: Session["user"];
}

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const isOwner = user.role === "OWNER" || user.role === "ADMIN";
    const isAdmin = user.role === "ADMIN";

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
        ...(isOwner ? ownerLinks : []),
        ...(isAdmin ? adminLinks : []),
    ];

    return (
        <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200 shadow-sm">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/dashboard" className="flex items-center font-bold text-xl">
                    RentHub
                </Link>
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
                                {link.name}
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
                        <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => signOut()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </div>
    );
} 