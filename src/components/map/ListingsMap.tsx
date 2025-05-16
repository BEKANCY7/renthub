"use client";

import { useState } from "react";
import GoogleListingsMap from "./GoogleListingsMap";
import { MapPin, Home } from "lucide-react";

interface Location {
    id: string;
    title: string;
    price: number;
    lat: number;
    lng: number;
    imageUrl?: string;
}

interface ListingsMapProps {
    locations: Location[];
    height?: string;
    onMarkerClick?: (id: string) => void;
}

// Ethiopia's center coordinates
const ETHIOPIA_CENTER = { lat: 9.145, lng: 40.4897 };

export default function ListingsMap({
    locations,
    height = "500px",
    onMarkerClick
}: ListingsMapProps) {
    // Use the Google Maps implementation
    return <GoogleListingsMap locations={locations} height={height} onMarkerClick={onMarkerClick} />;
} 