import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function to protect routes - DISABLED FOR DEMO MODE
export async function middleware(request: NextRequest) {
  // Allow all routes in demo mode
  console.log("Middleware: Allowing access to", request.nextUrl.pathname);
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
