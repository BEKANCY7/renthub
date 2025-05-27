"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  ShieldCheck,
  Flag,
} from "lucide-react";

interface TransactionStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export function TransactionStatusBadge({
  status,
  className = "",
  showIcon = true,
}: TransactionStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "COMPLETED":
        return "default"; // Green
      case "VERIFIED":
        return "outline"; // Green outline
      case "PENDING":
        return "secondary"; // Gray
      case "FAILED":
        return "destructive"; // Red
      case "REFUNDED":
        return "outline"; // Gray outline
      case "FLAGGED":
        return "destructive"; // Red
      default:
        return "outline";
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case "VERIFIED":
        return <ShieldCheck className="h-3.5 w-3.5 mr-1" />;
      case "PENDING":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "FAILED":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      case "REFUNDED":
        return <RotateCcw className="h-3.5 w-3.5 mr-1" />;
      case "FLAGGED":
        return <Flag className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge variant={getVariant()} className={`flex items-center ${className}`}>
      {getIcon()}
      {status}
    </Badge>
  );
}
