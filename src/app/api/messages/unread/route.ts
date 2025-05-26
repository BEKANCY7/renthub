import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/messages/unread - Get unread messages for the current user
 */
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since the Conversation and ConversationMessage models are not yet available in the Prisma client,
    // we'll return mock data for now

    // Mock unread messages
    const unreadMessages = [
      {
        id: "msg1",
        conversationId: "conv1",
        content: "Hello, I'm interested in your property.",
        createdAt: new Date(Date.now() - 3600000),
        sender: {
          id: "other-user-id",
          name: "John Doe",
          image: null,
        },
        conversation: {
          id: "conv1",
          listing: {
            id: "listing1",
            title: "Modern Apartment in Bole",
          },
        },
      },
      {
        id: "msg2",
        conversationId: "conv2",
        content: "Is this property still available?",
        createdAt: new Date(Date.now() - 1800000),
        sender: {
          id: "another-user-id",
          name: "Jane Smith",
          image: null,
        },
        conversation: {
          id: "conv2",
          listing: {
            id: "listing2",
            title: "Spacious Family Home in CMC",
          },
        },
      },
    ];

    return NextResponse.json({
      unreadMessages,
      count: unreadMessages.length,
    });
  } catch (error) {
    console.error("Error getting unread messages:", error);
    return NextResponse.json(
      { error: "Failed to get unread messages" },
      { status: 500 }
    );
  }
}
