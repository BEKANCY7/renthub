import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Search, Home, Info, Mail } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Messages - RentHub",
  description: "Your conversations on RentHub",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistSans.variable} flex flex-col h-screen`}>
      {/* Top Navigation Bar */}
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">RentHub</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              href="/find-home"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary"
            >
              <Search className="h-4 w-4" />
              <span>Find Home</span>
            </Link>
            <Link
              href="/listings"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary"
            >
              <Home className="h-4 w-4" />
              <span>Listings</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
