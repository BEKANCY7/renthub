import { Suspense } from "react";
import { Metadata } from "next";
import PropertySearch from "@/components/property/PropertySearch";
import { SearchFilters } from "@/components/property/SearchFilters";
import SearchSkeleton from "@/components/property/SearchSkeleton";

export const metadata: Metadata = {
    title: "Search Properties - RentHub",
    description: "Find your perfect home or rental property",
};

export default function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Find Your Perfect Place</h1>

                    <SearchFilters
                        initialFilters={searchParams}
                        className="mb-6"
                    />

                    <Suspense fallback={<SearchSkeleton />}>
                        <PropertySearch searchParams={searchParams} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
} 