"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    InfoWindowF,
    HeatmapLayerF
} from "@react-google-maps/api";
import { MapPin, ListFilter } from "lucide-react";

import PropertyCard from "@/components/property/PropertyCard";
import PropertyMapCard from "@/components/property/PropertyMapCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useProperties from "@/hooks/useProperties";

// Mock crime data for heatmap (in a real app, this would come from an API)
const crimeData = [
    { lat: 9.0084, lng: 38.7648, weight: 0.2 }, // Bole
    { lat: 9.0094, lng: 38.7658, weight: 0.3 },
    { lat: 9.0104, lng: 38.7668, weight: 0.5 },
    { lat: 9.0114, lng: 38.7678, weight: 0.1 },
    { lat: 9.0124, lng: 38.7688, weight: 0.4 },
];

// Map styles
const mapContainerStyle = {
    width: "100%",
    height: "calc(100vh - 200px)",
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
    clickableIcons: false,
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

export default function PropertySearch({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const router = useRouter();
    const { properties, isLoading } = useProperties(searchParams);
    const [viewType, setViewType] = useState<"grid" | "map">("grid");
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [mapCenter, setMapCenter] = useState({ lat: 9.0084, lng: 38.7648 }); // Default: Addis Ababa
    const [zoom, setZoom] = useState(12);

    const { isLoaded: mapsLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyD2I6LbGbD1xoDPQHUHsbn0Fb9kptFc4O8",
        libraries: ["places", "visualization"],
    });

    // Update map center based on location search
    useEffect(() => {
        const location = searchParams.location as string;
        if (location && mapsLoaded) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: location }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    const { lat, lng } = results[0].geometry.location;
                    setMapCenter({ lat: lat(), lng: lng() });
                    setZoom(12);
                }
            });
        }
    }, [searchParams.location, mapsLoaded]);

    // Property markers for map
    const markers = useMemo(() => {
        if (!properties) return [];
        return properties.map((property) => ({
            id: property.id,
            position: {
                lat: property.latitude,
                lng: property.longitude,
            },
            price: property.price,
            property,
        }));
    }, [properties]);

    if (isLoading) {
        return <SearchSkeleton />;
    }

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                    {properties ? (
                        properties.length === 0 ? (
                            "No properties found"
                        ) : (
                            `${properties.length} properties found`
                        )
                    ) : (
                        "Loading properties..."
                    )}
                </h2>
                <div className="flex space-x-2">
                    <Button
                        variant={viewType === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewType("grid")}
                    >
                        <ListFilter className="mr-2 h-4 w-4" />
                        List View
                    </Button>
                    <Button
                        variant={viewType === "map" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewType("map")}
                    >
                        <MapPin className="mr-2 h-4 w-4" />
                        Map View
                    </Button>
                </div>
            </div>

            {viewType === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties && properties.length > 0 ? (
                        properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <h3 className="text-xl font-medium mb-2">No properties found</h3>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your search filters to find more properties
                            </p>
                            <Button onClick={() => router.push("/find-home")}>
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-8/12 h-[calc(100vh-200px)] rounded-lg overflow-hidden">
                        {(!mapsLoaded || loadError) && (
                            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <p className="text-gray-500">
                                    {loadError ? "Error loading map" : "Loading map..."}
                                </p>
                            </div>
                        )}

                        {mapsLoaded && !loadError && (
                            <div className="relative h-full">
                                <GoogleMap
                                    id="property-map"
                                    mapContainerStyle={mapContainerStyle}
                                    zoom={zoom}
                                    center={mapCenter}
                                    options={mapOptions}
                                    onClick={() => setSelectedProperty(null)}
                                >
                                    {markers.map((marker) => (
                                        <MarkerF
                                            key={marker.id}
                                            position={marker.position}
                                            onClick={() => setSelectedProperty(marker.id)}
                                            label={{
                                                text: `ETB ${marker.price}`,
                                                color: "white",
                                                fontWeight: "bold",
                                                fontSize: "14px",
                                                className: "marker-label",
                                            }}
                                        >
                                            {selectedProperty === marker.id && (
                                                <InfoWindowF
                                                    position={marker.position}
                                                    onCloseClick={() => setSelectedProperty(null)}
                                                >
                                                    <PropertyMapCard property={marker.property} />
                                                </InfoWindowF>
                                            )}
                                        </MarkerF>
                                    ))}

                                    {showHeatmap && (
                                        <HeatmapLayerF
                                            data={crimeData.map(
                                                (point) =>
                                                    new google.maps.LatLng(point.lat, point.lng)
                                            )}
                                            options={{
                                                radius: 20,
                                                opacity: 0.6,
                                            }}
                                        />
                                    )}
                                </GoogleMap>

                                <div className="absolute bottom-4 left-4 z-10 bg-white rounded-md shadow-md p-2">
                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            variant={showHeatmap ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setShowHeatmap(!showHeatmap)}
                                        >
                                            {showHeatmap ? "Hide" : "Show"} Crime Data
                                        </Button>
                                        {/* Add more data layer toggles here */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-4/12 overflow-y-auto h-[calc(100vh-200px)]">
                        <div className="space-y-4 pr-2">
                            {properties && properties.length > 0 ? (
                                properties.map((property) => (
                                    <div
                                        key={property.id}
                                        className={`cursor-pointer ${selectedProperty === property.id
                                            ? "border-2 border-primary"
                                            : "border border-gray-200"
                                            } rounded-lg overflow-hidden hover:shadow-md transition-shadow`}
                                        onClick={() => {
                                            setSelectedProperty(property.id);
                                            setMapCenter({
                                                lat: property.latitude,
                                                lng: property.longitude,
                                            });
                                        }}
                                    >
                                        <PropertyCard
                                            property={property}
                                            compact
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <h3 className="text-xl font-medium mb-2">
                                        No properties found
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Try adjusting your search filters
                                    </p>
                                    <Button onClick={() => router.push("/find-home")}>
                                        Reset Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SearchSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                >
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="w-3/4 h-4" />
                        <Skeleton className="w-1/2 h-4" />
                        <Skeleton className="w-full h-4" />
                        <div className="flex justify-between">
                            <Skeleton className="w-1/3 h-4" />
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 