"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    BedDouble,
    Bath,
    Square,
    MapPin,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    address: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    latitude: number;
    longitude: number;
    propertyType: string;
    isFeatured?: boolean;
}

interface PropertyCardProps {
    property: Property;
    compact?: boolean;
}

export default function PropertyCard({ property, compact = false }: PropertyCardProps) {
    return (
        <Card className={`overflow-hidden h-full ${compact ? 'shadow-none border-0' : 'shadow-sm'}`}>
            <div className="relative">
                <div className={`relative ${compact ? 'h-32' : 'h-48'} bg-gray-100`}>
                    <Image
                        src={property.imageUrl || "https://source.unsplash.com/random/?property"}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                    {property.isFeatured && (
                        <Badge className="absolute top-2 left-2 bg-primary" variant="secondary">
                            Featured
                        </Badge>
                    )}
                    <Badge className="absolute top-2 right-2" variant="outline">
                        {property.propertyType}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full hover:bg-white"
                    >
                        <Heart className="h-4 w-4 text-gray-600" />
                        <span className="sr-only">Save property</span>
                    </Button>
                </div>
            </div>

            <CardHeader className={compact ? 'py-2 px-3' : 'py-4'}>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className={compact ? 'text-base' : 'text-xl'}>
                            {property.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{property.city}, {property.state}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`font-bold ${compact ? 'text-lg' : 'text-xl'}`}>
                            ETB {property.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 block">/month</span>
                    </div>
                </div>
            </CardHeader>

            {!compact && (
                <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">
                        {property.description}
                    </CardDescription>

                    <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            <span>{property.squareFeet} ft²</span>
                        </div>
                    </div>
                </CardContent>
            )}

            {!compact && (
                <CardFooter>
                    <Link href={`/listings/${property.id}`} className="w-full">
                        <Button variant="default" className="w-full">
                            View Details
                        </Button>
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
} 