export interface LocationDetails {
    address: string;
    city?: string;
    state?: string;
    country?: string;
    coords?: {
        lat: number;
        lng: number;
    };
    [key: string]: string | undefined | { lat: number; lng: number } | undefined;
}

export interface ImageFile {
    name: string;
    size: number;
    url: string;
    file: File;
}

export interface CalendarProps {
    mode?: "single" | "range";
    selected?: Date;
    onSelect?: (date: Date) => void;
    initialFocus?: boolean;
} 