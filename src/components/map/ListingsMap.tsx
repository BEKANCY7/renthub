"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin } from "lucide-react";

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
const DEFAULT_ZOOM = 6;

export default function ListingsMap({
    locations,
    height = "500px",
    onMarkerClick
}: ListingsMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load Google Maps API
    useEffect(() => {
        const loadMap = async () => {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

            // If no API key is provided, show a fallback UI
            if (!apiKey || apiKey === "your_google_maps_api_key_here") {
                setError("No Google Maps API key provided.");
                return;
            }

            const loader = new Loader({
                apiKey,
                version: "weekly",
            });

            try {
                await loader.load();
                setMapLoaded(true);
            } catch (error) {
                console.error("Error loading Google Maps API:", error);
                setError("Failed to load Google Maps.");
            }
        };

        loadMap();
    }, []);

    // Initialize map when API is loaded and ref is available
    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;

        const mapOptions: google.maps.MapOptions = {
            center: ETHIOPIA_CENTER,
            zoom: DEFAULT_ZOOM,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            mapId: "RentHub_map",
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);
        setInfoWindow(new google.maps.InfoWindow());

    }, [mapLoaded]);

    // Add markers when map is ready and locations change
    useEffect(() => {
        if (!map || !infoWindow) return;

        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);

        // Create new markers
        const newMarkers = locations.map(location => {
            const position = {
                lat: location.lat || ETHIOPIA_CENTER.lat,
                lng: location.lng || ETHIOPIA_CENTER.lng
            };

            const marker = new google.maps.Marker({
                position,
                map,
                title: location.title,
                animation: google.maps.Animation.DROP,
            });

            // Create info window content
            const contentString = `
        <div class="p-2 max-w-[200px]">
          ${location.imageUrl ? `<img src="${location.imageUrl}" alt="${location.title}" class="w-full h-24 object-cover mb-2 rounded" />` : ''}
          <h3 class="font-bold text-sm">${location.title}</h3>
          <p class="text-sm">ETB ${location.price.toLocaleString()}/day</p>
          <button class="text-blue-600 text-xs mt-1 underline">View Details</button>
        </div>
      `;

            // Add click event to marker
            marker.addListener("click", () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);

                if (onMarkerClick) {
                    onMarkerClick(location.id);
                }
            });

            return marker;
        });

        setMarkers(newMarkers);

        // Fit bounds if we have multiple locations
        if (newMarkers.length > 1) {
            const bounds = new google.maps.LatLngBounds();
            locations.forEach(location => {
                bounds.extend({
                    lat: location.lat || ETHIOPIA_CENTER.lat,
                    lng: location.lng || ETHIOPIA_CENTER.lng
                });
            });
            map.fitBounds(bounds);
        }
    }, [map, infoWindow, locations, onMarkerClick]);

    // Fallback UI when map can't be loaded
    if (error) {
        return (
            <div
                className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex flex-col items-center justify-center"
                style={{ height }}
            >
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <MapPin className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Map unavailable</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                        The location map is currently unavailable. Please check your Google Maps API configuration.
                    </p>
                </div>
                <div className="border-t border-gray-200 w-full p-4 text-center text-sm text-gray-500">
                    <p>Listing is located in Ethiopia</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div
                ref={mapRef}
                style={{ height, width: '100%' }}
                className={`${!mapLoaded ? 'bg-gray-100 flex items-center justify-center' : ''}`}
            >
                {!mapLoaded && !error && <div>Loading map...</div>}
            </div>
        </div>
    );
} 