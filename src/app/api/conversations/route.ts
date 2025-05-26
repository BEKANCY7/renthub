import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Schema for creating a new conversation
const createConversationSchema = z.object({
  receiverId: z.string(),
  listingId: z.string().optional(),
  initialMessage: z.string().min(1).max(2000),
});

/**
 * POST /api/conversations - Create a new conversation
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
    const { receiverId, listingId, initialMessage } =
      createConversationSchema.parse(body);

    // Prevent users from starting conversations with themselves
    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot start a conversation with yourself" },
        { status: 400 }
      );
    }

    // Check if the receiver exists
    const receiver = await db.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // If a listing ID is provided, verify it exists
    if (listingId) {
      const listing = await db.listing.findUnique({
        where: { id: listingId },
      });

      if (!listing) {
        return NextResponse.json(
          { error: "Listing not found" },
          { status: 404 }
        );
      }
    }

    // Since the Conversation and ConversationMessage models are not yet available in the Prisma client,
    // we'll mock the response

    // Mock conversation and message creation
    const conversation = {
      id: `conv-${Date.now()}`,
      starterId: session.user.id,
      receiverId: receiverId,
      listingId: listingId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const message = {
      id: `msg-${Date.now()}`,
      content: initialMessage,
      conversationId: conversation.id,
      senderId: session.user.id,
      createdAt: new Date(),
      isRead: false,
    };

    return NextResponse.json({
      conversation,
      message,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/conversations - Get conversations for the current user
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
    const limitParam = url.searchParams.get("limit");
    const cursor = url.searchParams.get("cursor");
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    // Since the Conversation and ConversationMessage models are not yet available in the Prisma client,
    // we'll return mock data

    // Mock conversations
    const conversations = [
      {
        id: "conv1",
        starterId: session.user.id,
        receiverId: "user1",
        updatedAt: new Date(Date.now() - 3600000),
        starter: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
        receiver: {
          id: "user1",
          name: "John Doe",
          image: null,
        },
        listing: {
          id: "listing1",
          title: "Modern Apartment in Bole",
          imageUrls: "https://example.com/image1.jpg",
          price: 25000,
        },
        booking: {
          id: "booking1",
          status: "PENDING",
        },
        messages: [
          {
            id: "msg1",
            content: "Hello, I'm interested in your property.",
            createdAt: new Date(Date.now() - 3600000),
          },
        ],
        _count: {
          messages: 2,
        },
      },
      {
        id: "conv2",
        starterId: "user2",
        receiverId: session.user.id,
        updatedAt: new Date(Date.now() - 7200000),
        starter: {
          id: "user2",
          name: "Jane Smith",
          image: null,
        },
        receiver: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
        listing: {
          id: "listing2",
          title: "Spacious Family Home in CMC",
          imageUrls: "https://example.com/image2.jpg",
          price: 38000,
        },
        booking: null,
        messages: [
          {
            id: "msg2",
            content: "Is this property still available?",
            createdAt: new Date(Date.now() - 7200000),
          },
        ],
        _count: {
          messages: 0,
        },
      },
    ];

    // Get the next cursor
    const nextCursor = null; // No more conversations in mock data

    return NextResponse.json({
      conversations,
      nextCursor,
    });
  } catch (error) {
    console.error("Error getting conversations:", error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}
