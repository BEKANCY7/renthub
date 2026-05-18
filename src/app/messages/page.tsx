"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
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
import { Badge } from "@/components/ui/badge";
import { ConversationView } from "@/components/messages/ConversationView";
import { cn } from "@/lib/utils";

// Mock conversations data - loads instantly
const mockConversations = [
  {
    id: "conv1",
    starterId: "user1",
    receiverId: "user2",
    starter: {
      id: "user1",
      name: "John Doe",
      image: "",
    },
    receiver: {
      id: "user2",
      name: "Jane Smith",
      image: "",
    },
    listing: {
      id: "listing1",
      title: "Modern Apartment in Bole",
      imageUrls: "/images/property-placeholder.jpg",
      price: 1500,
    },
    messages: [
      {
        id: "msg1",
        content: "Hi, is this property still available?",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        senderId: "user1",
      },
    ],
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    _count: {
      messages: 1,
    },
  },
];

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get("conversation");

  const [showMobileConversationList, setShowMobileConversationList] = useState(
    !selectedConversationId
  );

  // Use mock data - no loading delay
  const conversations = mockConversations;
  const isLoading = false;
  const error = null;

  const getOtherUser = (conversation: (typeof mockConversations)[0]) => {
    // In a real app, determine based on current user
    return conversation.receiver;
  };

  const getLastMessage = (conversation: (typeof mockConversations)[0]) => {
    return conversation.messages[conversation.messages.length - 1];
  };

  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, h:mm a");
    } catch {
      return "";
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        <div
          className={cn(
            "w-full md:w-80 border-r flex-shrink-0 overflow-y-auto",
            !showMobileConversationList && "hidden md:block"
          )}
        >
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Start a conversation by contacting a property owner
              </p>
              <Button asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                const lastMessage = getLastMessage(conversation);
                const isSelected = selectedConversationId === conversation.id;

                return (
                  <Link
                    key={conversation.id}
                    href={`/messages?conversation=${conversation.id}`}
                    className={cn(
                      "flex items-start gap-3 p-3 hover:bg-gray-100 transition-colors border-b",
                      isSelected && "bg-gray-100"
                    )}
                    onClick={() => setShowMobileConversationList(false)}
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {otherUser.image ? (
                          <img
                            src={otherUser.image}
                            alt={otherUser.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{otherUser.name}</p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatMessageTime(lastMessage.createdAt)}
                        </span>
                      </div>

                      {conversation.listing && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Home className="h-3 w-3" />
                          <span className="truncate">
                            {conversation.listing.title}
                          </span>
                        </div>
                      )}

                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage.content}
                      </p>
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
              <div className="md:hidden p-2 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileConversationList(true)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>
              <ConversationView
                conversationId={selectedConversationId}
                isAdmin={false}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-lg">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <MessageCircle className="h-12 w-12 text-gray-300 animate-pulse" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
