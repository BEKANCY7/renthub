"use client";

import { useState, useEffect } from "react";

// Mock property data
const mockProperties = [
    {
        id: "prop1",
        title: "Modern Apartment in Downtown",
        description: "A beautiful modern apartment located in the heart of downtown with amazing city views and access to local amenities.",
        price: 2500,
        imageUrl: "https://source.unsplash.com/random/?apartment,modern",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        latitude: 40.712776,
        longitude: -74.005974,
        propertyType: "APARTMENT",
        amenities: ["wifi", "parking", "ac"]
    },
    {
        id: "prop2",
        title: "Spacious Family Home",
        description: "Perfect family home with a large backyard, modern kitchen, and close to excellent schools and parks.",
        price: 3800,
        imageUrl: "https://source.unsplash.com/random/?house,family",
        address: "456 Oak Ave",
        city: "Brooklyn",
        state: "NY",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2200,
        latitude: 40.650002,
        longitude: -73.949997,
        propertyType: "HOUSE",
        amenities: ["garden", "parking", "ac", "pool"]
    },
    {
        id: "prop3",
        title: "Cozy Studio Near Campus",
        description: "Ideal for students, this cozy studio is walking distance to campus and features modern appliances and furnishings.",
        price: 1200,
        imageUrl: "https://source.unsplash.com/random/?studio,apartment",
        address: "789 College Blvd",
        city: "Queens",
        state: "NY",
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 550,
        latitude: 40.742054,
        longitude: -73.769417,
        propertyType: "APARTMENT",
        amenities: ["wifi", "furnished"]
    },
    {
        id: "prop4",
        title: "Luxury Penthouse with Rooftop",
        description: "Stunning penthouse with private rooftop terrace, floor-to-ceiling windows, and premium finishes throughout.",
        price: 7500,
        imageUrl: "https://source.unsplash.com/random/?penthouse,luxury",
        address: "101 Luxury Lane",
        city: "Manhattan",
        state: "NY",
        bedrooms: 3,
        bathrooms: 3.5,
        squareFeet: 3000,
        latitude: 40.783060,
        longitude: -73.971249,
        propertyType: "APARTMENT",
        amenities: ["wifi", "parking", "ac", "pool", "gym"]
    },
    {
        id: "prop5",
        title: "Charming Townhouse",
        description: "Beautiful townhouse with original details, updated kitchen and bathrooms, and private garden.",
        price: 4200,
        imageUrl: "https://source.unsplash.com/random/?townhouse,charming",
        address: "202 Historic St",
        city: "New York",
        state: "NY",
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1800,
        latitude: 40.690093,
        longitude: -73.991084,
        propertyType: "TOWNHOUSE",
        amenities: ["garden", "fireplace", "furnished"]
    },
    {
        id: "prop6",
        title: "Modern Loft in Converted Warehouse",
        description: "Stylish loft space with high ceilings, exposed brick, and industrial finishes in a converted warehouse.",
        price: 3400,
        imageUrl: "https://source.unsplash.com/random/?loft,warehouse",
        address: "303 Industrial Ave",
        city: "Brooklyn",
        state: "NY",
        bedrooms: 1,
        bathrooms: 2,
        squareFeet: 1500,
        latitude: 40.672104,
        longitude: -73.989304,
        propertyType: "APARTMENT",
        amenities: ["wifi", "ac", "furnished"]
    }
];

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
    amenities: string[];
}

export default function useProperties(searchParams: { [key: string]: string | string[] | undefined }) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API loading delay
        setIsLoading(true);

        setTimeout(() => {
            let filteredProperties = [...mockProperties];

            // Apply filters based on search params
            if (searchParams.location) {
                const location = searchParams.location as string;
                filteredProperties = filteredProperties.filter(
                    property =>
                        property.city.toLowerCase().includes(location.toLowerCase()) ||
                        property.state.toLowerCase().includes(location.toLowerCase()) ||
                        property.address.toLowerCase().includes(location.toLowerCase())
                );
            }

            if (searchParams.propertyType) {
                filteredProperties = filteredProperties.filter(
                    property => property.propertyType === searchParams.propertyType
                );
            }

            if (searchParams.minPrice) {
                const minPrice = parseInt(searchParams.minPrice as string);
                filteredProperties = filteredProperties.filter(
                    property => property.price >= minPrice
                );
            }

            if (searchParams.maxPrice) {
                const maxPrice = parseInt(searchParams.maxPrice as string);
                filteredProperties = filteredProperties.filter(
                    property => property.price <= maxPrice
                );
            }

            if (searchParams.bedrooms) {
                const minBedrooms = parseInt(searchParams.bedrooms as string);
                filteredProperties = filteredProperties.filter(
                    property => property.bedrooms >= minBedrooms
                );
            }

            if (searchParams.bathrooms) {
                const minBathrooms = parseInt(searchParams.bathrooms as string);
                filteredProperties = filteredProperties.filter(
                    property => property.bathrooms >= minBathrooms
                );
            }

            if (searchParams.minArea) {
                const minArea = parseInt(searchParams.minArea as string);
                filteredProperties = filteredProperties.filter(
                    property => property.squareFeet >= minArea
                );
            }

            if (searchParams.amenities) {
                const amenities = Array.isArray(searchParams.amenities)
                    ? searchParams.amenities
                    : [searchParams.amenities];

                filteredProperties = filteredProperties.filter(property =>
                    amenities.every(amenity =>
                        property.amenities.includes(amenity as string)
                    )
                );
            }

            setProperties(filteredProperties);
            setIsLoading(false);
        }, 1000); // Simulate network delay
    }, [searchParams]);

    return { properties, isLoading };
} 