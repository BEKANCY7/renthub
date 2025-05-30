import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/conversations - Get all conversations with pagination and filters
export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You must be an admin to access this resource" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Parse filter parameters
    const search = searchParams.get("search");
    const hasUnread = searchParams.get("hasUnread") === "true";

    // Build where clause
    let where: any = {};

    if (search) {
      where.OR = [
        {
          starter: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          receiver: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          messages: {
            some: {
              content: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (hasUnread) {
      where.messages = {
        some: {
          isRead: false,
        },
      };
    }

    // Count total conversations for pagination
    const totalConversations = await prisma.conversation.count({ where });

    // Fetch conversations with latest message
    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
      include: {
        starter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // For each conversation, count unread messages
    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            isRead: false,
          },
        });

        // Format the conversation data
        return {
          id: conversation.id,
          participants: [conversation.starter, conversation.receiver],
          lastMessage: conversation.messages[0]
            ? {
                content: conversation.messages[0].content,
                createdAt: conversation.messages[0].createdAt,
                read: conversation.messages[0].isRead,
              }
            : null,
          unreadCount,
        };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithUnreadCount,
      totalConversations,
      currentPage: page,
      totalPages: Math.ceil(totalConversations / limit),
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
