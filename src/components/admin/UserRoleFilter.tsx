"use client";

import { Role } from "@prisma/client";

interface UserRoleFilterProps {
  role: string;
}

export function UserRoleFilter({ role }: UserRoleFilterProps) {
  let badgeClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  switch (role) {
    case "ADMIN":
      badgeClasses += " bg-red-100 text-red-800";
      break;
    case "OWNER":
      badgeClasses += " bg-blue-100 text-blue-800";
      break;
    case "RENTER":
      badgeClasses += " bg-green-100 text-green-800";
      break;
    default:
      badgeClasses += " bg-gray-100 text-gray-800";
  }

  return <span className={badgeClasses}>{role}</span>;
}
