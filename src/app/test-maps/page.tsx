"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ListingsMap from "@/components/map/ListingsMap";
import { useEthiopianLocations } from "@/hooks/useEthiopianLocations";

export default function TestMapsPage() {
    const [locationCount, setLocationCount] = useState<number>(15);
    const [mapHeight, setMapHeight] = useState<string>("600px");
    const locations = useEthiopianLocations(locationCount);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

    const handleMarkerClick = (id: string) => {
        setSelectedLocation(id);
    };

    return (
        <div className="container mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Google Maps API Test (Ethiopia)</h1>
            <p className="text-muted-foreground">
                This page demonstrates the integration of Google Maps API with a focus on Ethiopia.
            </p>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-9">
                    <Card>
                        <CardHeader>
                            <CardTitle>Interactive Map of Ethiopia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ListingsMap
                                locations={locations}
                                height={mapHeight}
                                onMarkerClick={handleMarkerClick}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-3">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Map Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="locationCount">Location Count</Label>
                                <RadioGroup
                                    value={locationCount.toString()}
                                    onValueChange={(value) => setLocationCount(parseInt(value))}
                                    className="flex space-x-2 mt-2"
                                >
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="5" id="count-5" />
                                        <Label htmlFor="count-5">5</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="10" id="count-10" />
                                        <Label htmlFor="count-10">10</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="15" id="count-15" />
                                        <Label htmlFor="count-15">15</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="25" id="count-25" />
                                        <Label htmlFor="count-25">25</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div>
                                <Label htmlFor="mapHeight">Map Height</Label>
                                <RadioGroup
                                    value={mapHeight}
                                    onValueChange={setMapHeight}
                                    className="flex space-x-2 mt-2"
                                >
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="400px" id="height-400" />
                                        <Label htmlFor="height-400">400px</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="600px" id="height-600" />
                                        <Label htmlFor="height-600">600px</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="800px" id="height-800" />
                                        <Label htmlFor="height-800">800px</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedLocation && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Selected Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {locations.filter(loc => loc.id === selectedLocation).map(location => (
                                    <div key={location.id} className="space-y-2">
                                        <div className="w-full h-32 bg-gray-200 rounded overflow-hidden">
                                            <img
                                                src={location.imageUrl}
                                                alt={location.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="font-medium">{location.title}</h3>
                                        <p className="text-sm font-bold">ETB {location.price.toLocaleString()}/day</p>
                                        <p className="text-xs text-muted-foreground">
                                            Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                        </p>
                                        <Button size="sm" className="w-full">View Details</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
} 