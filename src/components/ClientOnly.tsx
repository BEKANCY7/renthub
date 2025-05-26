"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to render children only on the client-side
 * This helps prevent hydration errors when server and client renders differ
 */
export default function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after component mounts on client
    setIsMounted(true);
  }, []);

  // Render fallback or nothing during SSR or initial client render
  if (!isMounted) {
    return fallback;
  }

  // Once mounted on client, render children
  return <>{children}</>;
}
