import { NextRequest, NextResponse } from "next/server";

// This route generates a placeholder image for the login page
export async function GET(request: NextRequest) {
  try {
    // Get the size from query parameters or use default
    const { searchParams } = new URL(request.url);
    const width = searchParams.get("width") || "1470";
    const height = searchParams.get("height") || "980";
    const quality = searchParams.get("quality") || "80";

    // Redirect to a placeholder image service with responsive parameters
    return NextResponse.redirect(
      `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=${quality}&w=${width}&h=${height}&auto=format&fit=crop`
    );
  } catch (error) {
    console.error("Error generating placeholder image:", error);
    return new NextResponse("Error generating placeholder image", {
      status: 500,
    });
  }
}
