import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function to protect routes
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an admin route
  if (pathname.startsWith("/admin")) {
    // Check for authentication token in cookies
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // Redirect to login if no token
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  // Check if user is trying to access protected routes
  const protectedRoutes = ["/dashboard", "/find-home", "/profile", "/messages"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export default middleware;

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/find-home/:path*",
    "/profile/:path*",
    "/messages/:path*",
  ],
};
