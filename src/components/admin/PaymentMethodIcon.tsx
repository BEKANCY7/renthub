"use client";

import {
  CreditCard,
  Smartphone,
  Building,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";

interface PaymentMethodIconProps {
  method: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export function PaymentMethodIcon({
  method,
  size = 16,
  className = "",
  showLabel = false,
}: PaymentMethodIconProps) {
  const getIcon = () => {
    switch (method) {
      case "CARD":
        return (
          <CreditCard size={size} className={`text-blue-500 ${className}`} />
        );
      case "TELEBIRR":
        return (
          <div className="relative">
            <Image
              src="/images/telebirr-logo.png"
              alt="Telebirr"
              width={size}
              height={size}
              className={className}
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="${className}"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="${size}" width="${size}" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"></path></svg></span>`;
                }
              }}
            />
          </div>
        );
      case "CBE":
        return (
          <div className="relative">
            <Image
              src="/images/cbe-logo.png"
              alt="CBE"
              width={size}
              height={size}
              className={className}
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="${className}"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="${size}" width="${size}" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>`;
                }
              }}
            />
          </div>
        );
      case "CASH":
        return (
          <DollarSign size={size} className={`text-green-500 ${className}`} />
        );
      default:
        return (
          <HelpCircle size={size} className={`text-gray-500 ${className}`} />
        );
    }
  };

  const getLabel = () => {
    switch (method) {
      case "CARD":
        return "Card";
      case "TELEBIRR":
        return "Telebirr";
      case "CBE":
        return "CBE";
      case "CASH":
        return "Cash";
      default:
        return "Other";
    }
  };

  return (
    <div className="flex items-center gap-1">
      {getIcon()}
      {showLabel && <span className="text-xs font-medium">{getLabel()}</span>}
    </div>
  );
}
