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
import { PaymentMethodIcon } from "./PaymentMethodIcon";

const paymentMethods = [
  { value: "ALL", label: "All Methods" },
  { value: "TELEBIRR", label: "Telebirr" },
  { value: "CBE", label: "CBE" },
  { value: "CARD", label: "Card" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
];

interface PaymentMethodFilterProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  className?: string;
}

export function PaymentMethodFilter({
  selectedMethod,
  onMethodChange,
  className,
}: PaymentMethodFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedMethodLabel =
    paymentMethods.find((method) => method.value === selectedMethod)?.label ||
    "All Methods";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <div className="flex items-center">
            {selectedMethod !== "ALL" && (
              <PaymentMethodIcon method={selectedMethod} className="mr-2" />
            )}
            {selectedMethodLabel}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search method..." />
          <CommandEmpty>No method found.</CommandEmpty>
          <CommandGroup>
            {paymentMethods.map((method) => (
              <CommandItem
                key={method.value}
                value={method.value}
                onSelect={() => {
                  onMethodChange(method.value);
                  setOpen(false);
                }}
              >
                <div className="flex items-center">
                  {method.value !== "ALL" && (
                    <PaymentMethodIcon method={method.value} className="mr-2" />
                  )}
                  {method.label}
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedMethod === method.value
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
