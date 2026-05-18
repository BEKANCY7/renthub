import type { Metadata } from "next";
import { Geist } from "next/font/google";

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
    <div className={`${geistSans.variable} flex h-screen`}>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
