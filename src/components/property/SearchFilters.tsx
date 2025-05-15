"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    DollarSign,
    BedDouble,
    Bath,
    Home,
    Square,
    Footprints,
    Dog,
    ChevronDown,
    ChevronUp,
    Filter,
    X,
    Wifi,
    Car,
    UtilityPole,
    Trees,
    Flame,
    AirVent,
    Waves
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Slider
} from "@/components/ui/slider";
import {
    Checkbox
} from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/property/LocationSearch";

const propertyTypes = [
    { label: "House", value: "HOUSE" },
    { label: "Apartment", value: "APARTMENT" },
    { label: "Condo", value: "CONDO" },
    { label: "Townhouse", value: "TOWNHOUSE" },
    { label: "Villa", value: "VILLA" },
    { label: "Cabin", value: "CABIN" },
    { label: "Land", value: "LAND" },
];

const amenities = [
    { label: "Air Conditioning", value: "ac", icon: AirVent },
    { label: "Parking", value: "parking", icon: Car },
    { label: "Pet Friendly", value: "petFriendly", icon: Dog },
    { label: "Swimming Pool", value: "pool", icon: Waves },
    { label: "Wifi", value: "wifi", icon: Wifi },
    { label: "Garden/Patio", value: "garden", icon: Trees },
    { label: "Utilities Included", value: "utilities", icon: UtilityPole },
    { label: "Furnished", value: "furnished", icon: Home },
    { label: "Fireplace", value: "fireplace", icon: Flame },
];

interface SearchFiltersProps {
    initialFilters?: { [key: string]: string | string[] | undefined };
    className?: string;
}

export function SearchFilters({ initialFilters = {}, className }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [expanded, setExpanded] = useState(false);
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // State for filters
    const [location, setLocation] = useState<string>(
        (initialFilters.location as string) || ""
    );
    const [propertyType, setPropertyType] = useState<string>(
        (initialFilters.propertyType as string) || "any"
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([
        parseInt(initialFilters.minPrice as string) || 0,
        parseInt(initialFilters.maxPrice as string) || 10000,
    ]);
    const [bedrooms, setBedrooms] = useState<string>(
        (initialFilters.bedrooms as string) || "any"
    );
    const [bathrooms, setBathrooms] = useState<string>(
        (initialFilters.bathrooms as string) || "any"
    );
    const [minArea, setMinArea] = useState<string>(
        (initialFilters.minArea as string) || ""
    );
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
        Array.isArray(initialFilters.amenities)
            ? initialFilters.amenities
            : typeof initialFilters.amenities === 'string'
                ? [initialFilters.amenities]
                : []
    );

    // Update URL with filters
    const updateFilters = useCallback(() => {
        const params = new URLSearchParams();

        if (location) params.set("location", location);
        if (propertyType && propertyType !== "any") params.set("propertyType", propertyType);
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
        if (bedrooms && bedrooms !== "any") params.set("bedrooms", bedrooms);
        if (bathrooms && bathrooms !== "any") params.set("bathrooms", bathrooms);
        if (minArea) params.set("minArea", minArea);

        selectedAmenities.forEach(amenity => {
            params.append("amenities", amenity);
        });

        router.push(`/search?${params.toString()}`);
    }, [
        location,
        propertyType,
        priceRange,
        bedrooms,
        bathrooms,
        minArea,
        selectedAmenities,
        router
    ]);

    // Count active filters
    useEffect(() => {
        let count = 0;
        if (location) count++;
        if (propertyType && propertyType !== "any") count++;
        if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
        if (bedrooms && bedrooms !== "any") count++;
        if (bathrooms && bathrooms !== "any") count++;
        if (minArea) count++;
        count += selectedAmenities.length;

        setActiveFilterCount(count);
    }, [
        location,
        propertyType,
        priceRange,
        bedrooms,
        bathrooms,
        minArea,
        selectedAmenities
    ]);

    // Reset all filters
    const resetFilters = () => {
        setLocation("");
        setPropertyType("any");
        setPriceRange([0, 10000]);
        setBedrooms("any");
        setBathrooms("any");
        setMinArea("");
        setSelectedAmenities([]);
        router.push("/search");
    };

    // Toggle amenity selection
    const toggleAmenity = (value: string) => {
        setSelectedAmenities(prev =>
            prev.includes(value)
                ? prev.filter(a => a !== value)
                : [...prev, value]
        );
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Desktop filters */}
            <div className="hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-full md:w-96">
                        <LocationSearch
                            value={location}
                            onChange={setLocation}
                            className="w-full"
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                                <DollarSign className="mr-2 h-4 w-4" />
                                <span>
                                    {priceRange[0] === 0 && priceRange[1] === 10000
                                        ? "Any Price"
                                        : `$${priceRange[0]} - $${priceRange[1] === 10000 ? "10k+" : priceRange[1]}`}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-4 p-2">
                                <h3 className="font-medium">Price Range</h3>
                                <div className="flex justify-between">
                                    <div className="w-1/2 pr-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange[0]}
                                            onChange={(e) =>
                                                setPriceRange([
                                                    parseInt(e.target.value) || 0,
                                                    priceRange[1]
                                                ])
                                            }
                                        />
                                    </div>
                                    <div className="w-1/2 pl-2">
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange[1] === 10000 ? '' : priceRange[1]}
                                            onChange={(e) =>
                                                setPriceRange([
                                                    priceRange[0],
                                                    parseInt(e.target.value) || 10000
                                                ])
                                            }
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[priceRange[0], priceRange[1]]}
                                    min={0}
                                    max={10000}
                                    step={100}
                                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                                    className="pt-4"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>$0</span>
                                    <span>$5,000</span>
                                    <span>$10,000+</span>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Select
                        value={bedrooms}
                        onValueChange={setBedrooms}
                    >
                        <SelectTrigger className="w-[140px]">
                            <div className="flex items-center">
                                <BedDouble className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Beds" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={bathrooms}
                        onValueChange={setBathrooms}
                    >
                        <SelectTrigger className="w-[140px]">
                            <div className="flex items-center">
                                <Bath className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Baths" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={() => setExpanded(!expanded)}>
                        {expanded ? (
                            <>
                                <ChevronUp className="mr-2 h-4 w-4" />
                                Less Filters
                            </>
                        ) : (
                            <>
                                <ChevronDown className="mr-2 h-4 w-4" />
                                More Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-2" variant="secondary">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </>
                        )}
                    </Button>

                    <Button onClick={updateFilters}>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </div>

                {expanded && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-medium mb-2">Property Type</h3>
                            <Select
                                value={propertyType}
                                onValueChange={setPropertyType}
                            >
                                <SelectTrigger>
                                    <div className="flex items-center">
                                        <Home className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Any Property Type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any Property Type</SelectItem>
                                    {propertyTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="mt-4">
                                <label htmlFor="minArea" className="font-medium mb-2 block">
                                    Minimum Area (sq ft)
                                </label>
                                <div className="flex items-center">
                                    <Square className="mr-2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="minArea"
                                        type="number"
                                        placeholder="Any"
                                        value={minArea}
                                        onChange={(e) => setMinArea(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Amenities</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {amenities.slice(0, 6).map((amenity) => (
                                    <div key={amenity.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity.value}`}
                                            checked={selectedAmenities.includes(amenity.value)}
                                            onCheckedChange={() => toggleAmenity(amenity.value)}
                                        />
                                        <label
                                            htmlFor={`amenity-${amenity.value}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                        >
                                            <amenity.icon className="mr-2 h-3 w-3" />
                                            {amenity.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">More Amenities</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {amenities.slice(6).map((amenity) => (
                                    <div key={amenity.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity.value}`}
                                            checked={selectedAmenities.includes(amenity.value)}
                                            onCheckedChange={() => toggleAmenity(amenity.value)}
                                        />
                                        <label
                                            htmlFor={`amenity-${amenity.value}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                        >
                                            <amenity.icon className="mr-2 h-3 w-3" />
                                            {amenity.label}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={resetFilters}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Reset All Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile filters */}
            <div className="md:hidden">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                        <LocationSearch
                            value={location}
                            onChange={setLocation}
                            className="w-full"
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        <Filter className="h-4 w-4" />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>

                    <Button size="sm" onClick={updateFilters}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {showMobileFilters && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="price">
                                <AccordionTrigger>
                                    <span className="flex items-center">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Price Range
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <div className="w-1/2 pr-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={priceRange[0]}
                                                    onChange={(e) =>
                                                        setPriceRange([
                                                            parseInt(e.target.value) || 0,
                                                            priceRange[1]
                                                        ])
                                                    }
                                                />
                                            </div>
                                            <div className="w-1/2 pl-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={priceRange[1] === 10000 ? '' : priceRange[1]}
                                                    onChange={(e) =>
                                                        setPriceRange([
                                                            priceRange[0],
                                                            parseInt(e.target.value) || 10000
                                                        ])
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Slider
                                            value={[priceRange[0], priceRange[1]]}
                                            min={0}
                                            max={10000}
                                            step={100}
                                            onValueChange={(value) => setPriceRange([value[0], value[1]])}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="bedsbaths">
                                <AccordionTrigger>
                                    <span className="flex items-center">
                                        <Home className="mr-2 h-4 w-4" />
                                        Beds & Baths
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Bedrooms</label>
                                            <Select
                                                value={bedrooms}
                                                onValueChange={setBedrooms}
                                            >
                                                <SelectTrigger>
                                                    <div className="flex items-center">
                                                        <BedDouble className="mr-2 h-4 w-4" />
                                                        <SelectValue placeholder="Any" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="1">1+</SelectItem>
                                                    <SelectItem value="2">2+</SelectItem>
                                                    <SelectItem value="3">3+</SelectItem>
                                                    <SelectItem value="4">4+</SelectItem>
                                                    <SelectItem value="5">5+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Bathrooms</label>
                                            <Select
                                                value={bathrooms}
                                                onValueChange={setBathrooms}
                                            >
                                                <SelectTrigger>
                                                    <div className="flex items-center">
                                                        <Bath className="mr-2 h-4 w-4" />
                                                        <SelectValue placeholder="Any" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="1">1+</SelectItem>
                                                    <SelectItem value="2">2+</SelectItem>
                                                    <SelectItem value="3">3+</SelectItem>
                                                    <SelectItem value="4">4+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="propertytype">
                                <AccordionTrigger>
                                    <span className="flex items-center">
                                        <Home className="mr-2 h-4 w-4" />
                                        Property Type
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Select
                                        value={propertyType}
                                        onValueChange={setPropertyType}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any Property Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any Property Type</SelectItem>
                                            {propertyTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="area">
                                <AccordionTrigger>
                                    <span className="flex items-center">
                                        <Square className="mr-2 h-4 w-4" />
                                        Area
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex items-center">
                                        <Input
                                            type="number"
                                            placeholder="Min sq ft"
                                            value={minArea}
                                            onChange={(e) => setMinArea(e.target.value)}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="amenities">
                                <AccordionTrigger>
                                    <span className="flex items-center">
                                        <Wifi className="mr-2 h-4 w-4" />
                                        Amenities
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 gap-2">
                                        {amenities.map((amenity) => (
                                            <div key={amenity.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`mobile-amenity-${amenity.value}`}
                                                    checked={selectedAmenities.includes(amenity.value)}
                                                    onCheckedChange={() => toggleAmenity(amenity.value)}
                                                />
                                                <label
                                                    htmlFor={`mobile-amenity-${amenity.value}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                                >
                                                    <amenity.icon className="mr-2 h-3 w-3" />
                                                    {amenity.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex gap-2 mt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={resetFilters}
                            >
                                Reset All
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    updateFilters();
                                    setShowMobileFilters(false);
                                }}
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {location && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {location}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setLocation("")}
                            />
                        </Badge>
                    )}

                    {propertyType && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {propertyTypes.find(t => t.value === propertyType)?.label || propertyType}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setPropertyType("any")}
                            />
                        </Badge>
                    )}

                    {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            ${priceRange[0]} - ${priceRange[1] === 10000 ? "10k+" : priceRange[1]}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setPriceRange([0, 10000])}
                            />
                        </Badge>
                    )}

                    {bedrooms && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {bedrooms}+ Beds
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setBedrooms("any")}
                            />
                        </Badge>
                    )}

                    {bathrooms && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {bathrooms}+ Baths
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setBathrooms("any")}
                            />
                        </Badge>
                    )}

                    {minArea && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {minArea}+ sq ft
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setMinArea("")}
                            />
                        </Badge>
                    )}

                    {selectedAmenities.map(amenity => {
                        const amenityLabel = amenities.find(a => a.value === amenity)?.label || amenity;
                        return (
                            <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                                {amenityLabel}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => toggleAmenity(amenity)}
                                />
                            </Badge>
                        );
                    })}

                    {activeFilterCount > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="h-6 text-xs"
                        >
                            Clear All
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
} 