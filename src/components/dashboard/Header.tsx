"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Search, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MessageNotifications from "@/components/MessageNotifications";

interface HeaderProps {
  user: Session["user"];
  setMobileNavOpen?: (open: boolean) => void;
}

export default function Header({ user, setMobileNavOpen }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/find-home?location=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 md:gap-4 border-b bg-white px-4 sm:px-6">
      {/* Mobile menu button */}
      {setMobileNavOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      )}

      {/* Logo for mobile */}
      <div className="md:hidden font-bold text-lg">RentHub</div>

      {/* Search bar - hidden on mobile */}
      <div className="relative hidden md:flex md:grow">
        <form onSubmit={handleSearch} className="w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search properties..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="hidden">
            Search
          </Button>
        </form>
      </div>

      {/* User menu and notifications */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <MessageNotifications context="dashboard" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback>
                  {user.name ? user.name[0] : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.name || "User"}
                </p>
                <p className="text-xs leading-none text-gray-500 truncate">
                  {user.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/messages">Messages</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile search - full width below header */}
      <div className="absolute left-0 right-0 top-16 md:hidden border-b bg-white px-4 py-2">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="w-full pl-8 pr-4 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </header>
  );
}
