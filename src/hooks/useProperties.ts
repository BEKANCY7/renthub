"use client";

import { useState, useEffect } from "react";

// Mock property data
const mockProperties = [
    {
        id: "prop1",
        title: "Modern Apartment in Bole",
        description: "A beautiful modern apartment located in the heart of Bole with amazing city views and access to local amenities.",
        price: 25000,
        imageUrl: "https://source.unsplash.com/random/?apartment,modern",
        address: "Bole Road",
        city: "Addis Ababa",
        state: "Ethiopia",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        latitude: 9.0084,
        longitude: 38.7648,
        propertyType: "APARTMENT",
        amenities: ["wifi", "parking", "ac"]
    },
    {
        id: "prop2",
        title: "Spacious Family Home in CMC",
        description: "Perfect family home with a large backyard, modern kitchen, and close to excellent schools and parks in CMC area.",
        price: 38000,
        imageUrl: "https://source.unsplash.com/random/?house,family",
        address: "CMC Road",
        city: "Addis Ababa",
        state: "Ethiopia",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2200,
        latitude: 9.0233,
        longitude: 38.7232,
        propertyType: "HOUSE",
        amenities: ["garden", "parking", "ac", "pool"]
    },
    {
        id: "prop3",
        title: "Cozy Studio Near Addis Ababa University",
        description: "Ideal for students, this cozy studio is walking distance to AAU and features modern appliances and furnishings.",
        price: 12000,
        imageUrl: "https://source.unsplash.com/random/?studio,apartment",
        address: "Sidist Kilo",
        city: "Addis Ababa",
        state: "Ethiopia",
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 550,
        latitude: 9.0378,
        longitude: 38.7615,
        propertyType: "APARTMENT",
        amenities: ["wifi", "furnished"]
    },
    {
        id: "prop4",
        title: "Luxury Penthouse in Kazanchis",
        description: "Stunning penthouse with private rooftop terrace, floor-to-ceiling windows, and premium finishes throughout.",
        price: 75000,
        imageUrl: "https://source.unsplash.com/random/?penthouse,luxury",
        address: "Kazanchis",
        city: "Addis Ababa",
        state: "Ethiopia",
        bedrooms: 3,
        bathrooms: 3.5,
        squareFeet: 3000,
        latitude: 9.0163,
        longitude: 38.7573,
        propertyType: "APARTMENT",
        amenities: ["wifi", "parking", "ac", "pool", "gym"]
    },
    {
        id: "prop5",
        title: "Charming Villa in Old Airport",
        description: "Beautiful villa with original details, updated kitchen and bathrooms, and private garden in Old Airport area.",
        price: 42000,
        imageUrl: "https://source.unsplash.com/random/?villa,charming",
        address: "Old Airport Road",
        city: "Addis Ababa",
        state: "Ethiopia",
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1800,
        latitude: 9.0002,
        longitude: 38.7776,
        propertyType: "HOUSE",
        amenities: ["garden", "fireplace", "furnished"]
    },
    {
        id: "prop6",
        title: "Modern Loft in Sarbet",
        description: "Stylish loft space with high ceilings, exposed brick, and industrial finishes in the Sarbet area.",
        price: 34000,
        imageUrl: "https://source.unsplash.com/random/?loft,warehouse",
        address: "Sarbet Road",
        city: "Addis Ababa",
        state: "Ethiopia",
        bedrooms: 1,
        bathrooms: 2,
        squareFeet: 1500,
        latitude: 8.9947,
        longitude: 38.7534,
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