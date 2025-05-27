"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
}

const presets = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 6);
      return { from: lastWeek, to: today };
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 29);
      return { from: lastMonth, to: today };
    },
  },
  {
    label: "This month",
    getValue: () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: startOfMonth, to: today };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const today = new Date();
      const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: startOfLastMonth, to: endOfLastMonth };
    },
  },
  {
    label: "This year",
    getValue: () => {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return { from: startOfYear, to: today };
    },
  },
  {
    label: "All time",
    getValue: () => {
      return { from: null, to: null };
    },
  },
];

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
  className,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);

  const getDisplayText = () => {
    if (!startDate && !endDate) {
      return "All time";
    }

    if (startDate && !endDate) {
      return `From ${format(startDate, "MMM d, yyyy")}`;
    }

    if (!startDate && endDate) {
      return `Until ${format(endDate, "MMM d, yyyy")}`;
    }

    if (startDate && endDate) {
      if (format(startDate, "MMM d, yyyy") === format(endDate, "MMM d, yyyy")) {
        return format(startDate, "MMM d, yyyy");
      }
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }

    return "Select date range";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !startDate && !endDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Date Range</p>
            <Select
              onValueChange={(value) => {
                const preset = presets.find((preset) => preset.label === value);
                if (preset) {
                  const { from, to } = preset.getValue();
                  onDateChange(from, to);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.label} value={preset.label}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="p-3 flex flex-col sm:flex-row gap-2">
          <div>
            <p className="text-xs text-muted-foreground mb-2">From</p>
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => onDateChange(date, endDate)}
              disabled={(date) => endDate && date > endDate}
              initialFocus
              className="rounded-md border"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">To</p>
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => onDateChange(startDate, date)}
              disabled={(date) => startDate && date < startDate}
              initialFocus
              className="rounded-md border"
            />
          </div>
        </div>
        <div className="p-3 border-t flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDateChange(null, null);
              setOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            size="sm"
            className="ml-2"
            onClick={() => {
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
