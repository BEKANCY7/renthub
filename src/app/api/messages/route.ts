import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { filterMessage, logContactSharingAttempt } from "@/lib/messageFilter";

// Schema for creating a new message
const createMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1).max(2000),
});

// Schema for retrieving messages
const getMessagesSchema = z.object({
  conversationId: z.string(),
  limit: z.number().optional().default(50),
  cursor: z.string().optional(),
});

/**
 * POST /api/messages - Send a new message
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { conversationId, content } = createMessageSchema.parse(body);

    // Since the Conversation and ConversationMessage models are not yet available in the Prisma client,
    // we need to use a different approach

    // Filter message content if needed
    const { filteredMessage, wasFiltered, detectedPatterns } =
      filterMessage(content);

    // If contact info was detected, log the attempt
    if (wasFiltered) {
      await logContactSharingAttempt(
        session.user.id,
        content,
        detectedPatterns
      );

      // In a real implementation, you would create a security log entry
      console.log("Security log: Contact sharing attempt", {
        userId: session.user.id,
        eventType: "CONTACT_SHARING_ATTEMPT",
        description: "Attempted to share contact information in a message",
        metadata: JSON.stringify({
          conversationId,
          detectedPatterns,
        }),
      });
    }

    // Mock message creation response
    const message = {
      id: `msg-${Date.now()}`,
      content: filteredMessage,
      originalContent: wasFiltered ? content : undefined,
      wasFiltered: wasFiltered,
      filteredTypes: wasFiltered ? JSON.stringify(detectedPatterns) : undefined,
      conversationId,
      senderId: session.user.id,
      createdAt: new Date(),
      isRead: false,
    };

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/messages - Get messages for a conversation
 */
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");
    const limitParam = url.searchParams.get("limit");
    const cursor = url.searchParams.get("cursor");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    // Since the Conversation and ConversationMessage models are not yet available in the Prisma client,
    // we'll return mock data for now

    // Mock messages
    const messages = [
      {
        id: "msg1",
        content: "Hello, I'm interested in your property.",
        wasFiltered: false,
        createdAt: new Date(Date.now() - 3600000),
        senderId: session.user.id,
        isRead: true,
        sender: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
      },
      {
        id: "msg2",
        content: "Great! When would you like to view it?",
        wasFiltered: false,
        createdAt: new Date(Date.now() - 1800000),
        senderId: "other-user-id",
        isRead: true,
        sender: {
          id: "other-user-id",
          name: "Property Owner",
          image: null,
        },
      },
    ];

    // Get the next cursor
    const nextCursor = null; // No more messages in mock data

    return NextResponse.json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    return NextResponse.json(
      { error: "Failed to get messages" },
      { status: 500 }
    );
  }
}
