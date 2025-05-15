"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SearchSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                >
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="w-3/4 h-4" />
                        <Skeleton className="w-1/2 h-4" />
                        <Skeleton className="w-full h-4" />
                        <div className="flex justify-between">
                            <Skeleton className="w-1/3 h-4" />
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 