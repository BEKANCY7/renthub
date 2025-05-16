"use client";

import { MapPin, Home } from "lucide-react";

interface Location {
    id: string;
    title: string;
    price: number;
    lat: number;
    lng: number;
    imageUrl?: string;
}

interface EthiopiaMapProps {
    locations: Location[];
    height?: string;
    onMarkerClick?: (id: string) => void;
}

export default function EthiopiaMap({
    locations,
    height = "500px",
    onMarkerClick
}: EthiopiaMapProps) {
    const handleMarkerClick = (id: string) => {
        if (onMarkerClick) {
            onMarkerClick(id);
        }
    };

    return (
        <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative bg-slate-100" style={{ height, width: '100%' }}>
                {/* Map Background */}
                <div className="absolute inset-0 bg-slate-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>
                    {/* Ethiopia Outline (simplified) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" width="80%" height="80%" className="text-emerald-300 opacity-40">
                            <path
                                d="M30,20 C40,15 50,10 60,15 C70,20 80,30 75,40 C70,50 80,60 70,70 C60,80 40,80 30,70 C20,60 10,50 20,40 C30,30 20,25 30,20"
                                fill="currentColor"
                                stroke="#2c8f69"
                                strokeWidth="1"
                            />
                        </svg>
                    </div>
                </div>

                {/* Location Markers */}
                {locations.map((location) => {
                    // Create a visual position based on lat/lng
                    // Since we're not using a real map, just space them out visually
                    const posX = ((location.lng - 35) / 15) * 100; // Normalize to viewport percentage
                    const posY = ((location.lat - 5) / 10) * 100;  // Normalize to viewport percentage

                    return (
                        <div
                            key={location.id}
                            className="absolute cursor-pointer group"
                            style={{
                                left: `${Math.min(Math.max(posX, 5), 95)}%`,
                                top: `${Math.min(Math.max(posY, 5), 95)}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onClick={() => handleMarkerClick(location.id)}
                        >
                            <div className="flex flex-col items-center">
                                <div className="p-1 bg-white rounded-full shadow-md mb-1">
                                    <div className="bg-red-500 rounded-full p-1.5">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                {/* Hover Info Card */}
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="bg-white rounded-lg shadow-lg p-2 max-w-[180px]">
                                        {location.imageUrl && (
                                            <div className="w-full h-20 bg-gray-200 rounded overflow-hidden mb-2">
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
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Map Attribution */}
                <div className="absolute bottom-1 left-1 text-[8px] text-gray-500">
                    Map data for Ethiopia (Placeholder Map)
                </div>
            </div>
        </div>
    );
} 