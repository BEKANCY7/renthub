"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Script load status tracking
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
let isScriptLoaded = false;
let isScriptLoading = false;
let scriptLoadingPromise: Promise<void> | null = null;

// Load Google Maps script
const loadScript = () => {
    if (isScriptLoaded) return Promise.resolve();
    if (isScriptLoading && scriptLoadingPromise) return scriptLoadingPromise;

    isScriptLoading = true;
    scriptLoadingPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;

        // Ensure the callback is defined
        window.initMap = () => {
            isScriptLoaded = true;
            isScriptLoading = false;
            resolve();
        };

        script.onerror = (error) => {
            isScriptLoading = false;
            reject(error);
        };

        document.head.appendChild(script);
    });

    return scriptLoadingPromise;
};

// Make sure the window object is defined
declare global {
    interface Window {
        initMap: () => void;
    }
}

interface LocationSearchProps {
    value: string;
    onChange: (value: string) => void;
    onSelectLocation?: (details: {
        address: string;
        lat: number;
        lng: number;
    }) => void;
    className?: string;
}

export function LocationSearch({
    value,
    onChange,
    onSelectLocation,
    className,
}: LocationSearchProps) {
    const [scriptReady, setScriptReady] = useState(isScriptLoaded);

    useEffect(() => {
        if (!isScriptLoaded) {
            loadScript()
                .then(() => setScriptReady(true))
                .catch((error) => console.error("Error loading Google Maps script:", error));
        }
    }, []);

    const {
        ready,
        value: searchValue,
        setValue: setSearchValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "us" },
        },
        debounce: 300,
        defaultValue: value,
        callbackName: "initMap",
        initOnMount: false, // We're handling script loading ourselves
    });

    // Sync external value with internal state
    useEffect(() => {
        if (value !== searchValue) {
            setSearchValue(value);
        }
    }, [value, searchValue, setSearchValue]);

    const handleSelect = async (address: string) => {
        setSearchValue(address, false);
        onChange(address);
        clearSuggestions();

        if (onSelectLocation) {
            try {
                const results = await getGeocode({ address });
                const { lat, lng } = await getLatLng(results[0]);
                onSelectLocation({
                    address,
                    lat,
                    lng,
                });
            } catch (error) {
                console.error("Error getting geocode: ", error);
            }
        }
    };

    return (
        <div className={cn("relative w-full", className)}>
            <Combobox onSelect={handleSelect}>
                <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <ComboboxInput
                        as={Input}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        disabled={!ready || !scriptReady}
                        className="w-full pl-8"
                        placeholder={scriptReady ? "Enter a location..." : "Loading Google Maps..."}
                        aria-label="Search locations"
                    />
                    {searchValue && (
                        <button
                            className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setSearchValue("");
                                onChange("");
                                clearSuggestions();
                            }}
                        >
                            <span className="sr-only">Clear</span>
                            <Search className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {scriptReady && (
                    <ComboboxPopover className="z-50 mt-1 max-h-72 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <ComboboxList>
                            {status === "OK" &&
                                data.map(({ place_id, description }) => (
                                    <ComboboxOption
                                        key={place_id}
                                        value={description}
                                        className="relative cursor-default select-none py-2 px-3 text-gray-900 hover:bg-blue-50"
                                    />
                                ))}
                        </ComboboxList>
                        {status === "ZERO_RESULTS" && (
                            <div className="py-2 px-3 text-sm text-gray-500">No results found</div>
                        )}
                    </ComboboxPopover>
                )}
            </Combobox>
        </div>
    );
} 