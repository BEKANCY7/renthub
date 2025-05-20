"use client";

import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookingTimelineProps {
    booking: {
        status: string;
        createdAt: string;
        startDate: string;
        endDate: string;
        // Optionally add more fields if needed
    };
}

const statusSteps = [
    { key: "PENDING", label: "Requested", icon: Clock, color: "text-yellow-600" },
    { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "text-green-600" },
    { key: "COMPLETED", label: "Completed", icon: CheckCircle, color: "text-blue-600" },
    { key: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-600" },
];

export default function BookingTimeline({ booking }: BookingTimelineProps) {
    // Find the current step index
    const currentStepIndex = statusSteps.findIndex((step) => step.key === booking.status);

    return (
        <div className="flex items-center gap-2">
            {statusSteps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const Icon = step.icon;
                return (
                    <div key={step.key} className="flex items-center gap-1">
                        <Icon className={`h-4 w-4 ${isActive ? step.color : "text-gray-300"}`} />
                        <span className={`text-xs ${isActive ? "font-semibold" : "text-gray-400"}`}>{step.label}</span>
                        {idx < statusSteps.length - 1 && <span className="mx-1 text-gray-300">→</span>}
                    </div>
                );
            })}
            <Badge variant="outline" className="ml-2 text-xs">
                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
            </Badge>
        </div>
    );
} 