"use client";
// Auth handled by middleware

export default async function DashboardMessagesPage() {
  // TODO: Get user from your backend API
  const session = null;

  if (!session?.user) {
    redirect("/login?callbackUrl=/messages");
  }

  // Redirect to the main messages page
  redirect("/messages");
}
