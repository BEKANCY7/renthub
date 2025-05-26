import { NextRequest, NextResponse } from "next/server";

// This route generates a placeholder image for the login page
export async function GET(request: NextRequest) {
  try {
    // Redirect to a placeholder image service
    return NextResponse.redirect(
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop"
    );
  } catch (error) {
    return new NextResponse("Error generating placeholder image", {
      status: 500,
    });
  }
}
