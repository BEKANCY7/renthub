import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
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
  const session = await getServerSession(authOptions);

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
