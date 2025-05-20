import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PropertySearch from "@/components/property/PropertySearch";
import { SearchFilters } from "@/components/property/SearchFilters";
import SearchSkeleton from "@/components/property/SearchSkeleton";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export const metadata: Metadata = {
    title: "Find Home - RentHub",
    description: "Find your perfect home or rental property in Ethiopia",
};

export default async function FindHomePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Get the user session to pass to the sidebar
    const session = await getServerSession(authOptions);
    
    // If no user is logged in, we can still show the page but without the sidebar
    const user = session?.user;
    
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Only show sidebar if user is logged in */}
            {user && <Sidebar user={user} />}
            
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Only show header if user is logged in */}
                {user && <Header user={user} />}
                
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Home</h1>

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
        </div>
    );
}