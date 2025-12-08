"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { ConversationView } from "@/components/messages/ConversationView";

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    email: string;
    image?: string;
  }[];
  lastMessage: {
    content: string;
    createdAt: string;
    read: boolean;
  };
  unreadCount: number;
}

export default function AdminMessagingPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Fetch conversations from the API
    const fetchConversations = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "20");

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (activeTab === "unread") {
          params.append("hasUnread", "true");
        }

        const response = await fetch(
          `/api/admin/conversations?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();
        setConversations(data.conversations || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to load conversations");
        setLoading(false);
      }
    };

    fetchConversations();
  }, [searchQuery, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will trigger the useEffect due to searchQuery change
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // This week
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    // Older
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Support
          </h1>
          <p className="text-muted-foreground">
            Manage conversations and support tickets
          </p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:w-fit">
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle>Conversations</CardTitle>
                <form onSubmit={handleSearch} className="mt-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search conversations..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 p-4 rounded-md text-red-500">
                    {error}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No conversations found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                          selectedConversation === conversation.id
                            ? "bg-muted"
                            : ""
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={
                                  conversation.participants[0].image ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={conversation.participants[0].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">
                                {conversation.participants[0].name}
                              </div>
                              <div className="text-sm text-muted-foreground truncate max-w-[160px]">
                                {conversation.lastMessage.content}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <div className="text-xs text-muted-foreground">
                              {formatDate(conversation.lastMessage.createdAt)}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                variant="default"
                                className="px-2 py-0.5 text-xs"
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-0">
                {selectedConversation ? (
                  <ConversationView
                    conversationId={selectedConversation}
                    isAdmin={true}
                  />
                ) : (
                  <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                    Select a conversation to view messages
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground pb-4">
                Conversations with unread messages
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Last Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations
                    .filter((conv) => conv.unreadCount > 0)
                    .map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell>
                          <div className="font-medium">
                            {conversation.participants[0].name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {conversation.participants[0].email}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {conversation.lastMessage.content}
                        </TableCell>
                        <TableCell>
                          {formatDate(conversation.lastMessage.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {conversation.unreadCount} unread
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedConversation(conversation.id)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Resolved conversations will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
