import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Export the middleware function as both named and default export
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an admin route or admin API route
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET || "thisissecretkeyfornextauthlocaldev",
    });

    // Special case for admin@renthub.com - always allow access
    if (token?.email === "admin@renthub.com") {
      return NextResponse.next();
    }

    // If user is not logged in or not an admin, redirect to login or return unauthorized
    if (!token || token.role !== "ADMIN") {
      // For API routes, return unauthorized
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // For admin pages, redirect to login
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Also export as default
export default middleware;

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
