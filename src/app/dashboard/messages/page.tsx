"use client";
// Auth handled by middleware

export default async function DashboardMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/messages");
  }

  // Redirect to the main messages page
  redirect("/messages");
}
