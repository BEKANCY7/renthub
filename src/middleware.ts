import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Export the middleware function as both named and default export
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /admin
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET || "thisissecretkeyfornextauthlocaldev",
    });

    console.log("Middleware token for admin route:", token);

    // Special case for admin@renthub.com - always allow access
    if (token?.email === "admin@renthub.com") {
      console.log("Admin email detected, granting access");
      return NextResponse.next();
    }

    // If user is not logged in or not an admin, redirect to login
    if (!token || token.role !== "ADMIN") {
      console.log("Access denied to admin route. User role:", token?.role);
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    console.log("Admin access granted to:", pathname);
  }

  return NextResponse.next();
}

// Also export as default
export default middleware;

// Configure which routes the middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
};
