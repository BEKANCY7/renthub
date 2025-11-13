import { signOut } from "next-auth/react";
import { clearAuthTokens } from "./api";

/**
 * Logout from both local NextAuth and external API
 */
export async function logout(callbackUrl: string = "/login") {
  // Clear external API tokens
  clearAuthTokens();

  // Sign out from NextAuth
  await signOut({ callbackUrl });
}
