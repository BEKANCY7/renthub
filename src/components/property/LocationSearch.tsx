"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationSearchProps {
    value: string;
    onChange: (value: string) => void;
    onSelectLocation?: (details: LocationDetails) => void;
    className?: string;
    placeholder?: string;
}

interface LocationDetails {
    address: string;
    city?: string;
    state?: string;
    country?: string;
    coords?: {
        lat: number;
        lng: number;
    };
}

export function LocationSearch({
    value,
    onChange,
    onSelectLocation,
    className,
    placeholder = "Enter a location..."
}: LocationSearchProps) {
    const [suggestions, setSuggestions] = useState<LocationDetails[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        if (newValue.length > 2) {
            // Simple mock suggestions for Ethiopia locations
            const mockSuggestions: LocationDetails[] = [
                {
                    address: `${newValue}, Addis Ababa, Ethiopia`,
                    city: "Addis Ababa",
                    country: "Ethiopia",
                    coords: { lat: 9.0222, lng: 38.7468 }
                },
                {
                    address: `${newValue}, Dire Dawa, Ethiopia`,
                    city: "Dire Dawa",
                    country: "Ethiopia",
                    coords: { lat: 9.5907, lng: 41.8699 }
                },
                {
                    address: `${newValue}, Bahir Dar, Ethiopia`,
                    city: "Bahir Dar",
                    state: "Amhara",
                    country: "Ethiopia",
                    coords: { lat: 11.5742, lng: 37.3614 }
                },
                {
                    address: `${newValue}, Hawassa, Ethiopia`,
                    city: "Hawassa",
                    state: "SNNPR",
                    country: "Ethiopia",
                    coords: { lat: 7.0504, lng: 38.4955 }
                },
                {
                    address: `${newValue}, Mekelle, Ethiopia`,
                    city: "Mekelle",
                    state: "Tigray",
                    country: "Ethiopia",
                    coords: { lat: 13.4967, lng: 39.4697 }
                }
            ];

            setSuggestions(mockSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectLocation = (location: LocationDetails) => {
        onChange(location.address);
        if (onSelectLocation) {
            onSelectLocation(location);
        }
        setShowSuggestions(false);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={inputRef}>
            <Input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={cn(className)}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-1">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectLocation(suggestion)}
                            >
                                {suggestion.address}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
} 