import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default async function MessagesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Get all unique conversations (both sent and received)
    const sentMessages = await db.message.findMany({
        where: { senderId: session.user.id },
        include: {
            receiver: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const receivedMessages = await db.message.findMany({
        where: { receiverId: session.user.id },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Create a map of conversations by user
    const conversationMap = new Map();

    sentMessages.forEach(message => {
        const receiverId = message.receiverId;
        if (!conversationMap.has(receiverId)) {
            conversationMap.set(receiverId, {
                user: message.receiver,
                lastMessage: message,
                messages: []
            });
        }
        conversationMap.get(receiverId).messages.push(message);
    });

    receivedMessages.forEach(message => {
        const senderId = message.senderId;
        if (!conversationMap.has(senderId)) {
            conversationMap.set(senderId, {
                user: message.sender,
                lastMessage: message,
                messages: []
            });
        }
        conversationMap.get(senderId).messages.push(message);
    });

    // Convert map to array and sort by last message date
    const conversations = Array.from(conversationMap.values()).sort((a, b) =>
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            </div>

            {conversations.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No Messages</CardTitle>
                        <CardDescription>
                            You don't have any messages yet.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                    {/* Conversation List */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-3 border-b font-medium">Conversations</div>
                        <div className="overflow-y-auto h-[calc(100vh-230px)]">
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation.user.id}
                                    className="p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                                        {conversation.user.image ? (
                                            <img src={conversation.user.image} alt={conversation.user.name || 'User'} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg">{(conversation.user.name || conversation.user.email || 'U').charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{conversation.user.name || conversation.user.email}</div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {conversation.lastMessage.content}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Message Display */}
                    <div className="md:col-span-2 border rounded-lg flex flex-col">
                        <div className="p-3 border-b font-medium">
                            Select a conversation
                        </div>
                        <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
                            Click on a conversation to view messages
                        </div>
                        <div className="p-3 border-t flex">
                            <Input
                                className="flex-1 mr-2"
                                placeholder="Type a message..."
                                disabled
                            />
                            <Button size="icon" disabled>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 