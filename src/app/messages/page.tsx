"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ChevronLeft,
  MessageCircle,
  User,
  Home,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ConversationView } from "@/components/messages/ConversationView";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  starterId: string;
  receiverId: string;
  starter: {
    id: string;
    name: string;
    image: string;
  };
  receiver: {
    id: string;
    name: string;
    image: string;
  };
  listing?: {
    id: string;
    title: string;
    imageUrls: string;
    price: number;
  };
  booking?: {
    id: string;
    status: string;
  };
  messages: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  }[];
  updatedAt: string;
  _count: {
    messages: number;
  };
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get("conversation");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileConversationList, setShowMobileConversationList] = useState(
    !selectedConversationId
  );

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        router.push("/login?callbackUrl=/messages");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/conversations");

        if (!response.ok) {
          throw new Error("Failed to load conversations");
        }

        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setError("Failed to load conversations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Set up polling for new messages
    const intervalId = setInterval(fetchConversations, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [status, router]);

  // Handle mobile view toggling
  useEffect(() => {
    setShowMobileConversationList(!selectedConversationId);
  }, [selectedConversationId]);

  // Get other participant in conversation
  const getOtherParticipant = (conversation: Conversation) => {
    if (!session?.user?.id) return null;
    return conversation.starterId === session.user.id
      ? conversation.receiver
      : conversation.starter;
  };

  // Format last message timestamp
  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return isToday ? format(date, "h:mm a") : format(date, "MMM d");
  };

  // Get booking status badge color
  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Conversation List (hidden on mobile when viewing a conversation) */}
      <div
        className={cn(
          "w-full md:w-1/3 border-r bg-gray-50",
          !showMobileConversationList && "hidden md:block"
        )}
      >
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Communicate securely with property owners and renters
          </p>
        </div>

        {isLoading ? (
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 mb-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Start browsing properties to connect with owners
            </p>
            <Button asChild>
              <Link href="/find-home">Browse Properties</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const lastMessage = conversation.messages[0];

              return (
                <Link
                  key={conversation.id}
                  href={`/messages?conversation=${conversation.id}`}
                  className={cn(
                    "flex items-start gap-3 p-3 hover:bg-gray-100 transition-colors border-b",
                    selectedConversationId === conversation.id && "bg-gray-100"
                  )}
                >
                  {otherParticipant?.image ? (
                    <img
                      src={otherParticipant.image}
                      alt={otherParticipant.name || "User"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">
                        {otherParticipant?.name || "User"}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatLastMessageTime(conversation.updatedAt)}
                      </span>
                    </div>

                    {conversation.listing && (
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <Home className="h-3 w-3 mr-1" />
                        <span className="truncate">
                          {conversation.listing.title}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage?.content || "No messages yet"}
                      </p>

                      {conversation._count.messages > 0 && (
                        <Badge className="ml-2" variant="secondary">
                          {conversation._count.messages}
                        </Badge>
                      )}
                    </div>

                    {conversation.booking && (
                      <div className="mt-1">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            getBookingStatusColor(conversation.booking.status)
                          )}
                        >
                          {conversation.booking.status}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Conversation View */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          showMobileConversationList && "hidden md:flex"
        )}
      >
        {selectedConversationId ? (
          <>
            <div className="p-3 border-b flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => router.push("/messages")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {conversations.find((c) => c.id === selectedConversationId) && (
                <>
                  {(() => {
                    const conversation = conversations.find(
                      (c) => c.id === selectedConversationId
                    )!;
                    const otherParticipant = getOtherParticipant(conversation);

                    return (
                      <div className="flex items-center">
                        {otherParticipant?.image ? (
                          <img
                            src={otherParticipant.image}
                            alt={otherParticipant.name || "User"}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}

                        <div>
                          <h2 className="font-medium">
                            {otherParticipant?.name || "User"}
                          </h2>

                          {conversation.listing && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Home className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {conversation.listing.title}
                              </span>
                            </div>
                          )}
                        </div>

                        {conversation.booking && (
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full ml-3",
                              getBookingStatusColor(conversation.booking.status)
                            )}
                          >
                            {conversation.booking.status}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            <ConversationView conversationId={selectedConversationId} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
            <p className="text-muted-foreground max-w-sm">
              Choose a conversation from the list to start messaging securely
              with property owners and renters
            </p>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-50 border-t border-yellow-200 p-2 text-center md:hidden">
        <div className="flex items-center justify-center text-xs text-yellow-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>Contact info is only shared after booking confirmation</span>
        </div>
      </div>
    </div>
  );
}
