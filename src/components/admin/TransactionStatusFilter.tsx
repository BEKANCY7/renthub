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
import { TransactionStatusBadge } from "./TransactionStatusBadge";

const statuses = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "VERIFIED", label: "Verified" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "FLAGGED", label: "Flagged" },
];

interface TransactionStatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  className?: string;
}

export function TransactionStatusFilter({
  selectedStatus,
  onStatusChange,
  className,
}: TransactionStatusFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedStatusLabel =
    statuses.find((status) => status.value === selectedStatus)?.label ||
    "All Statuses";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedStatus !== "ALL" ? (
            <TransactionStatusBadge status={selectedStatus} showIcon={false} />
          ) : (
            selectedStatusLabel
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandEmpty>No status found.</CommandEmpty>
          <CommandGroup>
            {statuses.map((status) => (
              <CommandItem
                key={status.value}
                value={status.value}
                onSelect={() => {
                  onStatusChange(status.value);
                  setOpen(false);
                }}
              >
                {status.value === "ALL" ? (
                  status.label
                ) : (
                  <TransactionStatusBadge
                    status={status.value}
                    showIcon={false}
                  />
                )}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedStatus === status.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
