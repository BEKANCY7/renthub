"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // We're now using SideNavigation instead, so always return null
  return null;
}
