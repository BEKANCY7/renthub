import { clearAuthTokens } from "./api";

/**
 * Logout and clear all authentication data
 */
export function logout(callbackUrl: string = "/login") {
  // Clear all tokens and user data
  clearAuthTokens();

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = callbackUrl;
  }
}
