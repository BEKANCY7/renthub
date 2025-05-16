import { db } from "@/lib/db";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin } from "lucide-react";
import ListingsMap from "@/components/map/ListingsMap";

export default async function ListingsPage() {
    // Fetch all active listings
    const listings = await db.listing.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
    });

    // Format listings for map display
    const mapLocations = listings.map(listing => {
        // Generate random coordinates near Ethiopia's center if not provided
        // In a real app, you would have actual coordinates stored
        const randomLat = 9.145 + (Math.random() - 0.5) * 2;
        const randomLng = 40.4897 + (Math.random() - 0.5) * 2;

        return {
            id: listing.id,
            title: listing.title,
            price: listing.price,
            lat: randomLat,
            lng: randomLng,
            imageUrl: listing.imageUrls?.split(',')?.[0] || "https://source.unsplash.com/random/?property,ethiopia",
        };
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Find Your Next Home in Ethiopia</h1>

            <Tabs defaultValue="grid" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="map">Map View</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <Card key={listing.id} className="overflow-hidden">
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={listing.imageUrls?.split(',')[0] || "https://source.unsplash.com/random/?property,ethiopia"}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {listing.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xl font-bold">ETB {listing.price.toLocaleString()}/day</p>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{listing.city || "Addis Ababa"}, {listing.state || listing.country || "Ethiopia"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/listings/${listing.id}`}>
                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="map" className="mt-6">
                    <div className="space-y-4">
                        <div className="h-[600px] bg-gray-100 rounded-md overflow-hidden">
                            <ListingsMap locations={mapLocations} height="600px" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {listings.slice(0, 4).map((listing) => (
                                <Card key={listing.id} className="overflow-hidden">
                                    <div className="relative h-32 bg-gray-100">
                                        <img
                                            src={listing.imageUrls?.split(',')[0] || "https://source.unsplash.com/random/?property,ethiopia"}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-bold line-clamp-1">{listing.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {listing.city || "Addis Ababa"}, {listing.country || "Ethiopia"}
                                        </p>
                                        <p className="font-semibold mt-1">ETB {listing.price.toLocaleString()}/day</p>
                                        <Button asChild variant="outline" size="sm" className="w-full mt-2">
                                            <Link href={`/listings/${listing.id}`}>
                                                View
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 