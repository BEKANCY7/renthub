"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const roles = [
  { value: "ALL", label: "All Roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "OWNER", label: "Owner" },
  { value: "RENTER", label: "Renter" },
];

interface UserRoleFilterProps {
  role: string;
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
  className?: string;
}

export function UserRoleFilter({
  role,
  selectedRole,
  onRoleChange,
  className,
}: UserRoleFilterProps) {
  const [open, setOpen] = useState(false);

  // If onRoleChange is provided, we're in filter mode
  const isFilterMode = !!onRoleChange;

  // For filter mode, find the selected role label
  const selectedRoleLabel = isFilterMode
    ? roles.find((r) => r.value === selectedRole)?.label || "All Roles"
    : null;

  // For display mode, determine badge styling based on role
  let badgeClasses = isFilterMode
    ? ""
    : "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  if (!isFilterMode) {
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
  }

  // Display mode - just show the badge
  if (!isFilterMode) {
    return <span className={badgeClasses}>{role}</span>;
  }

  // Filter mode - show dropdown selector
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedRoleLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search role..." />
          <CommandEmpty>No role found.</CommandEmpty>
          <CommandGroup>
            {roles.map((role) => (
              <CommandItem
                key={role.value}
                value={role.value}
                onSelect={() => {
                  onRoleChange(role.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedRole === role.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {role.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
