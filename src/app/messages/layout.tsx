import type { Metadata } from "next";
import { Geist } from "next/font/google";
// Auth handled by middleware
import Sidebar from "@/components/dashboard/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Messages - RentHub",
  description: "Your conversations on RentHub",
};

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get user from your backend API
  const session = null;

  if (!session?.user) {
    redirect("/login?callbackUrl=/messages");
  }

  return (
    <div className={`${geistSans.variable} flex h-screen`}>
      <Sidebar user={session.user} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
