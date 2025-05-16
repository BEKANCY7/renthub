import { useMemo } from 'react';

interface Location {
    id: string;
    title: string;
    price: number;
    lat: number;
    lng: number;
    imageUrl?: string;
}

// Ethiopia's approximate bounding box
const ETHIOPIA_BOUNDS = {
    north: 14.8, // Northern latitude
    south: 3.4,  // Southern latitude
    east: 48.0,  // Eastern longitude
    west: 33.0   // Western longitude
};

// Major Ethiopian cities with their coordinates
const ETHIOPIAN_CITIES = [
    { name: "Addis Ababa", lat: 9.0222, lng: 38.7468 },
    { name: "Dire Dawa", lat: 9.5907, lng: 41.8699 },
    { name: "Mekelle", lat: 13.4967, lng: 39.4697 },
    { name: "Gondar", lat: 12.6030, lng: 37.4521 },
    { name: "Adama", lat: 8.5363, lng: 39.2705 },
    { name: "Hawassa", lat: 7.0504, lng: 38.4955 },
    { name: "Bahir Dar", lat: 11.5742, lng: 37.3614 },
    { name: "Jimma", lat: 7.6667, lng: 36.8333 },
    { name: "Dessie", lat: 11.1333, lng: 39.6333 },
    { name: "Jijiga", lat: 9.3500, lng: 42.8000 },
    { name: "Shashamane", lat: 7.2000, lng: 38.6000 },
    { name: "Bishoftu", lat: 8.7333, lng: 38.9833 },
    { name: "Sodo", lat: 6.8500, lng: 37.7500 },
    { name: "Arba Minch", lat: 6.0333, lng: 37.5500 },
    { name: "Hosaena", lat: 7.5500, lng: 37.8500 }
];

// Property types for variety
const PROPERTY_TYPES = [
    "Apartment", "House", "Villa", "Condominium", "Studio",
    "Office Space", "Vacation Home", "Traditional Home"
];

// Random price range (in ETB)
const MIN_PRICE = 500;  // 500 ETB/day
const MAX_PRICE = 5000; // 5000 ETB/day

/**
 * Generates a random number between min and max (inclusive)
 */
function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates random locations in Ethiopia
 */
export function useEthiopianLocations(count: number = 10): Location[] {
    return useMemo(() => {
        const locations: Location[] = [];

        // First, create locations in major cities
        const cityCount = Math.min(count, ETHIOPIAN_CITIES.length);
        for (let i = 0; i < cityCount; i++) {
            const city = ETHIOPIAN_CITIES[i];
            const propertyType = PROPERTY_TYPES[getRandomNumber(0, PROPERTY_TYPES.length - 1)];
            const price = getRandomNumber(MIN_PRICE, MAX_PRICE);

            // Add small randomness to avoid markers perfectly overlapping
            const latVariance = (Math.random() - 0.5) * 0.05;
            const lngVariance = (Math.random() - 0.5) * 0.05;

            locations.push({
                id: `city-${i}`,
                title: `${propertyType} in ${city.name}`,
                price,
                lat: city.lat + latVariance,
                lng: city.lng + lngVariance,
                imageUrl: `https://source.unsplash.com/random/300x200/?property,ethiopia,${propertyType.toLowerCase()}`
            });
        }

        // If we need more locations, generate random ones within Ethiopia
        if (count > cityCount) {
            for (let i = cityCount; i < count; i++) {
                const propertyType = PROPERTY_TYPES[getRandomNumber(0, PROPERTY_TYPES.length - 1)];
                const price = getRandomNumber(MIN_PRICE, MAX_PRICE);

                // Generate random coordinates within Ethiopia's bounds
                const lat = ETHIOPIA_BOUNDS.south + Math.random() * (ETHIOPIA_BOUNDS.north - ETHIOPIA_BOUNDS.south);
                const lng = ETHIOPIA_BOUNDS.west + Math.random() * (ETHIOPIA_BOUNDS.east - ETHIOPIA_BOUNDS.west);

                locations.push({
                    id: `random-${i}`,
                    title: `${propertyType} in Rural Area`,
                    price,
                    lat,
                    lng,
                    imageUrl: `https://source.unsplash.com/random/300x200/?rural,property,${propertyType.toLowerCase()}`
                });
            }
        }

        return locations;
    }, [count]);
} 