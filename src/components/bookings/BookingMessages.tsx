"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

type Message = {
    id: string;
    content: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        image?: string;
    };
};

type BookingMessagesProps = {
    bookingId: string;
    currentUserId: string;
};

export default function BookingMessages({ bookingId, currentUserId }: BookingMessagesProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchMessages();
        // Set up polling for new messages
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [bookingId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}/messages`);
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/bookings/${bookingId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            setNewMessage("");
            await fetchMessages();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    return (
        <div className="flex flex-col h-[400px] border rounded-lg">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender.id === currentUserId ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`flex items-start gap-2 max-w-[80%] ${message.sender.id === currentUserId ? "flex-row-reverse" : "flex-row"
                                    }`}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.sender.image} />
                                    <AvatarFallback>
                                        {message.sender.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>

                                <div
                                    className={`rounded-lg p-3 ${message.sender.id === currentUserId
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {format(new Date(message.createdAt), "MMM d, h:mm a")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
} 