import { clearAuthTokens, logoutFromExternalAPI } from "./api";

/**
 * Logout and clear all authentication data
 */
export async function logout(callbackUrl: string = "/login") {
  try {
    // Call logout API
    await logoutFromExternalAPI();
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with local cleanup even if API fails
  }

  // Clear all tokens and user data
  clearAuthTokens();

  // Clear auth cookie
  if (typeof window !== "undefined") {
    document.cookie = "auth_token=; path=/; max-age=0";
  }

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = callbackUrl;
  }
}
