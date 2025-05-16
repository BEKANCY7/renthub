"use client";

import { useState } from "react";
import { MapPin, Home } from "lucide-react";
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    InfoWindowF
} from "@react-google-maps/api";

interface Location {
    id: string;
    title: string;
    price: number;
    lat: number;
    lng: number;
    imageUrl?: string;
}

interface GoogleListingsMapProps {
    locations: Location[];
    height?: string;
    onMarkerClick?: (id: string) => void;
}

// Ethiopia's center coordinates
const ETHIOPIA_CENTER = { lat: 9.145, lng: 40.4897 };

// Map styles
const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ],
};

export default function GoogleListingsMap({
    locations,
    height = "500px",
    onMarkerClick
}: GoogleListingsMapProps) {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"],
    });

    const handleMarkerClick = (id: string) => {
        setSelectedLocation(id);
        if (onMarkerClick) {
            onMarkerClick(id);
        }
    };

    if (loadError) {
        return (
            <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-100" style={{ height }}>
                <p className="text-gray-500">Error loading Google Maps</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-100" style={{ height }}>
                <p className="text-gray-500">Loading maps...</p>
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm" style={{ height }}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={ETHIOPIA_CENTER}
                zoom={7}
                options={mapOptions}
                onClick={() => setSelectedLocation(null)}
            >
                {locations.map((location) => (
                    <MarkerF
                        key={location.id}
                        position={{ lat: location.lat, lng: location.lng }}
                        onClick={() => handleMarkerClick(location.id)}
                        label={{
                            text: `ETB ${Math.round(location.price / 1000)}k`,
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "12px",
                            className: "marker-label",
                        }}
                    >
                        {selectedLocation === location.id && (
                            <InfoWindowF
                                position={{ lat: location.lat, lng: location.lng }}
                                onCloseClick={() => setSelectedLocation(null)}
                            >
                                <div className="p-2 max-w-[200px]">
                                    {location.imageUrl && (
                                        <div className="w-full h-24 bg-gray-200 rounded overflow-hidden mb-2">
                                            <img
                                                src={location.imageUrl}
                                                alt={location.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="text-sm font-medium truncate">{location.title}</div>
                                    <div className="text-xs font-bold mt-1">ETB {location.price.toLocaleString()}/day</div>
                                    <div className="flex items-center mt-1 text-xs text-gray-500">
                                        <Home className="h-3 w-3 mr-1" />
                                        <span>View Details</span>
                                    </div>
                                </div>
                            </InfoWindowF>
                        )}
                    </MarkerF>
                ))}
            </GoogleMap>
        </div>
    );
} 