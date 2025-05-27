"use client";

interface UserStatusBadgeProps {
  status: string;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  let badgeClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  switch (status) {
    case "ACTIVE":
      badgeClasses += " bg-green-100 text-green-800";
      break;
    case "SUSPENDED":
      badgeClasses += " bg-yellow-100 text-yellow-800";
      break;
    case "DELETED":
      badgeClasses += " bg-red-100 text-red-800";
      break;
    default:
      badgeClasses += " bg-gray-100 text-gray-800";
  }

  return <span className={badgeClasses}>{status}</span>;
}
