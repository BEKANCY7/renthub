"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Home, Search, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageNotifications from "@/components/MessageNotifications";

export default function MainNavigation() {
  const { user, isAuthenticated } = useAuth();
  const session = isAuthenticated ? { user } : null;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { name: "Find Home", href: "/find-home", icon: Search },
    { name: "About", href: "/about", icon: Home },
    { name: "Contact", href: "/contact", icon: User },
  ];

  return (
    <>
      {/* Main navigation - desktop */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center font-bold text-xl text-primary"
            >
              RentHub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                <MessageNotifications />
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/dashboard">My Account</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex"
                >
                  <Link href="/register">Register</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link
              href="/"
              className="flex items-center font-bold text-xl text-primary"
            >
              RentHub
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center py-2 text-base font-medium"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-gray-200 my-4" />
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center py-2 text-base font-medium"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    className="flex items-center py-2 text-base font-medium"
                  >
                    <MessageNotifications context="mobile" />
                    <span className="ml-2">Messages</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center py-2 text-base font-medium"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center py-2 text-base font-medium"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
