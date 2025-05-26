"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { MessageItem } from "@/components/messages/MessageItem";
import { MessageInput } from "@/components/messages/MessageInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface Message {
  id: string;
  content: string;
  wasFiltered: boolean;
  originalContent?: string;
  filteredTypes?: string;
  createdAt: string | Date;
  senderId: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
  isRead: boolean;
}

interface Conversation {
  id: string;
  starterId: string;
  receiverId: string;
  booking?: {
    id: string;
    status: string;
  } | null;
  messages: Message[];
}

interface ConversationViewProps {
  conversationId: string;
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch conversation data
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/conversations/${conversationId}`);

        if (!response.ok) {
          throw new Error("Failed to load conversation");
        }

        const data = await response.json();
        setConversation(data);
        setMessages(data.messages.reverse() || []);
      } catch (error) {
        console.error("Error loading conversation:", error);
        setError("Failed to load conversation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();

    // Set up polling for new messages
    const intervalId = setInterval(fetchNewMessages, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [conversationId]);

  // Fetch new messages
  const fetchNewMessages = async () => {
    if (!conversationId || !messages.length) return;

    try {
      const latestMessageId = messages[0]?.id;
      const response = await fetch(
        `/api/messages?conversationId=${conversationId}&since=${latestMessageId}`
      );

      if (!response.ok) return;

      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        const newMessages = data.messages.reverse();
        setMessages((prev) => [...newMessages, ...prev]);

        // Check if user needs to be notified of new messages
        const isScrolledUp =
          messagesContainerRef.current &&
          messagesContainerRef.current.scrollHeight -
            messagesContainerRef.current.scrollTop -
            messagesContainerRef.current.clientHeight >
            100;

        if (isScrolledUp) {
          setHasNewMessages(true);
        } else {
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error("Error fetching new messages:", error);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasNewMessages(false);
  };

  // Scroll to bottom when conversation loads or changes
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [isLoading, conversationId]);

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id || !conversationId || !content.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Determine if contact sharing is allowed based on booking status
  const isContactSharingAllowed =
    conversation?.booking?.status === "CONFIRMED" ||
    conversation?.booking?.status === "COMPLETED";

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 overflow-y-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex w-full mb-4 ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[80%]">
                <Skeleton
                  className={`h-16 w-64 rounded-lg ${
                    i % 2 === 0 ? "ml-auto" : ""
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === session?.user?.id}
              showFilteredContent={isContactSharingAllowed}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {hasNewMessages && (
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-1 shadow-md"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
          New messages
        </Button>
      )}

      <MessageInput
        conversationId={conversationId}
        onSendMessage={handleSendMessage}
        isContactSharingAllowed={isContactSharingAllowed}
      />
    </div>
  );
}
