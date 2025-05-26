"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageItemProps {
  message: {
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
  };
  isCurrentUser: boolean;
  showFilteredContent?: boolean;
}

export function MessageItem({
  message,
  isCurrentUser,
  showFilteredContent = false,
}: MessageItemProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  // Parse filtered types if available
  const filteredTypes = message.filteredTypes
    ? JSON.parse(message.filteredTypes)
    : [];

  // Format the message timestamp
  const timestamp =
    typeof message.createdAt === "string"
      ? new Date(message.createdAt)
      : message.createdAt;

  const formattedTime = format(timestamp, "h:mm a");

  // Generate warning message based on filtered types
  const getWarningMessage = () => {
    if (!message.wasFiltered) return "";

    if (filteredTypes.includes("PHONE") && filteredTypes.includes("EMAIL")) {
      return "Phone numbers and email addresses were removed from this message";
    } else if (filteredTypes.includes("PHONE")) {
      return "Phone numbers were removed from this message";
    } else if (filteredTypes.includes("EMAIL")) {
      return "Email addresses were removed from this message";
    } else if (
      filteredTypes.includes("SOCIAL_MEDIA") ||
      filteredTypes.includes("MESSAGING_LINKS")
    ) {
      return "External messaging links were removed from this message";
    }

    return "Contact information was removed from this message";
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {!isCurrentUser && (
          <div className="flex items-center mb-1">
            {message.sender.image ? (
              <img
                src={message.sender.image}
                alt={message.sender.name || "User"}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 mr-2" />
            )}
            <span className="text-sm font-medium">
              {message.sender.name || "User"}
            </span>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Message bubble */}
          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-full break-words",
              isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {/* Message content */}
            <div className="whitespace-pre-wrap">
              {message.wasFiltered && showFilteredContent && showOriginal
                ? message.originalContent
                : message.content}
            </div>

            {/* Warning for filtered content */}
            {message.wasFiltered && (
              <div className="mt-1 flex items-center text-xs text-yellow-500">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>{getWarningMessage()}</span>
              </div>
            )}

            {/* Toggle to show original content if allowed */}
            {message.wasFiltered && showFilteredContent && (
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className="mt-1 text-xs underline focus:outline-none"
              >
                {showOriginal ? "Hide original" : "Show original"}
              </button>
            )}

            {/* Timestamp */}
            <div
              className={cn(
                "text-xs mt-1",
                isCurrentUser
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              {formattedTime}
            </div>
          </div>

          {/* Filtered indicator */}
          {message.wasFiltered && !showFilteredContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-yellow-500">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    For your security, contact information is hidden until a
                    booking is confirmed.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
