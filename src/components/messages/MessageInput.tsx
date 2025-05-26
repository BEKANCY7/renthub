"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  containsContactInfo,
  generateWarningMessage,
  filterMessage,
} from "@/lib/messageFilter";

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  isContactSharingAllowed?: boolean;
}

export function MessageInput({
  conversationId,
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  isContactSharingAllowed = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check for contact information as the user types
  useEffect(() => {
    if (!isContactSharingAllowed && message.trim()) {
      if (containsContactInfo(message)) {
        const { detectedPatterns } = filterMessage(message);
        setWarning(generateWarningMessage(detectedPatterns));
      } else {
        setWarning(null);
      }
    } else {
      setWarning(null);
    }
  }, [message, isContactSharingAllowed]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);
      await onSendMessage(message);
      setMessage("");
      setWarning(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle keyboard shortcuts (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t p-4">
      {warning && (
        <Alert variant="warning" className="mb-2 py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs ml-2">
            {warning}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className="min-h-[40px] max-h-[150px] resize-none flex-1"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled || isSubmitting}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>

      {!isContactSharingAllowed && (
        <p className="text-xs text-muted-foreground mt-2">
          For your security, sharing contact information is not allowed until a
          booking is confirmed.
        </p>
      )}
    </div>
  );
}
