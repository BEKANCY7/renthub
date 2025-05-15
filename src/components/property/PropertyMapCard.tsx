"use client";

import Link from "next/link";
import { BedDouble, Bath, Square } from "lucide-react";
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
}

interface PropertyMapCardProps {
    property: Property;
}

export default function PropertyMapCard({ property }: PropertyMapCardProps) {
    return (
        <div className="max-w-[250px]">
            <div className="relative h-28 w-full bg-gray-100 mb-2">
                <img
                    src={property.imageUrl || "https://source.unsplash.com/random/?property"}
                    alt={property.title}
                    className="h-full w-full object-cover"
                />
            </div>

            <h3 className="font-medium text-sm mb-1 line-clamp-1">{property.title}</h3>
            <p className="text-sm text-gray-500 mb-1 line-clamp-1">{property.city}, {property.state}</p>

            <div className="flex justify-between text-xs text-gray-600 mb-2">
                <div className="flex items-center">
                    <BedDouble className="h-3 w-3 mr-1" />
                    <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center">
                    <Bath className="h-3 w-3 mr-1" />
                    <span>{property.bathrooms}</span>
                </div>
                <div className="flex items-center">
                    <Square className="h-3 w-3 mr-1" />
                    <span>{property.squareFeet} ft²</span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <p className="font-bold text-sm">${property.price.toLocaleString()}<span className="font-normal text-xs text-gray-500">/mo</span></p>
                <Link href={`/properties/${property.id}`}>
                    <Button variant="default" size="sm" className="text-xs py-1 h-7">
                        Details
                    </Button>
                </Link>
            </div>
        </div>
    );
} 