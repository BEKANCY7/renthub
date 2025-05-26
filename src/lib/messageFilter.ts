/**
 * Message filtering utility for RentHub
 *
 * This module provides functions to detect and filter sensitive information
 * from messages, such as phone numbers, email addresses, and external messaging links.
 */

/**
 * Patterns to detect various types of contact information
 */
const PATTERNS = {
  // Phone numbers in various formats (international, local with/without dashes, etc.)
  PHONE:
    /(?<!\w)(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?(?:\d{1,4}[-.\s]?)?\d{4,}(?!\w)/g,

  // Email addresses
  EMAIL: /(?<!\w)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?!\w)/g,

  // Social media handles and URLs
  SOCIAL_MEDIA:
    /(?:^|\s)(?:@[\w.]+|(?:https?:\/\/)?(?:www\.)?(?:facebook|instagram|twitter|linkedin|telegram|t\.me)\.com\/[\w.]+)/gi,

  // Messaging app links (WhatsApp, Telegram, etc.)
  MESSAGING_LINKS:
    /(?:https?:\/\/)?(?:www\.)?(?:wa\.me|whatsapp\.com|t\.me|telegram\.me)\/[^\s]+/gi,

  // General URLs that might be used for communication
  EXTERNAL_URLS:
    /(?:https?:\/\/)?(?:www\.)?(?:meet|zoom|teams|chat|message)\.(?:com|us|org|io|me)[^\s]*/gi,
};

/**
 * Replacement messages for different types of filtered content
 */
const REPLACEMENTS = {
  PHONE: "***Phone number removed***",
  EMAIL: "***Email address removed***",
  SOCIAL_MEDIA: "***Social media contact removed***",
  MESSAGING_LINKS: "***External messaging link removed***",
  EXTERNAL_URLS: "***External URL removed***",
  DEFAULT: "***Contact information removed***",
};

/**
 * Detects if a message contains any contact information
 *
 * @param message - The message to check
 * @returns boolean - True if contact information is detected
 */
export function containsContactInfo(message: string): boolean {
  return Object.values(PATTERNS).some((pattern) => pattern.test(message));
}

/**
 * Filters out contact information from a message
 *
 * @param message - The message to filter
 * @returns object - The filtered message and a flag indicating if content was filtered
 */
export function filterMessage(message: string): {
  filteredMessage: string;
  wasFiltered: boolean;
  detectedPatterns: string[];
} {
  let filteredMessage = message;
  let wasFiltered = false;
  const detectedPatterns: string[] = [];

  // Check each pattern and apply replacements
  for (const [type, pattern] of Object.entries(PATTERNS)) {
    // Reset the regex lastIndex to ensure it works correctly with global flag
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
    }

    if (pattern.test(message)) {
      // Reset lastIndex again before replacing
      pattern.lastIndex = 0;
      filteredMessage = filteredMessage.replace(
        pattern,
        REPLACEMENTS[type] || REPLACEMENTS.DEFAULT
      );
      wasFiltered = true;
      detectedPatterns.push(type);
    }
  }

  return {
    filteredMessage,
    wasFiltered,
    detectedPatterns,
  };
}

/**
 * Generates a warning message for users when contact information is detected
 *
 * @param detectedPatterns - Array of pattern types detected
 * @returns string - A warning message
 */
export function generateWarningMessage(detectedPatterns: string[]): string {
  if (detectedPatterns.length === 0) return "";

  const warningBase =
    "For your security, sharing contact information before booking is not allowed.";

  if (
    detectedPatterns.includes("PHONE") &&
    detectedPatterns.includes("EMAIL")
  ) {
    return `${warningBase} We've removed phone numbers and email addresses from your message.`;
  } else if (detectedPatterns.includes("PHONE")) {
    return `${warningBase} We've removed phone numbers from your message.`;
  } else if (detectedPatterns.includes("EMAIL")) {
    return `${warningBase} We've removed email addresses from your message.`;
  } else if (
    detectedPatterns.includes("SOCIAL_MEDIA") ||
    detectedPatterns.includes("MESSAGING_LINKS")
  ) {
    return `${warningBase} We've removed external messaging links from your message.`;
  }

  return `${warningBase} We've removed contact information from your message.`;
}

/**
 * Logs an attempt to share contact information
 *
 * @param userId - The ID of the user who attempted to share contact info
 * @param messageContent - The original message content
 * @param detectedPatterns - Array of pattern types detected
 */
export function logContactSharingAttempt(
  userId: string,
  messageContent: string,
  detectedPatterns: string[]
): void {
  // In a real app, this would log to a database or monitoring system
  console.log(
    `[SECURITY] User ${userId} attempted to share contact information:`,
    {
      timestamp: new Date().toISOString(),
      userId,
      detectedPatterns,
      // In production, you might want to partially redact the original message
      originalMessage:
        messageContent.substring(0, 50) +
        (messageContent.length > 50 ? "..." : ""),
    }
  );
}
