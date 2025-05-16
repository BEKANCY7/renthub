// Type definitions for Google Maps JavaScript API for use with TypeScript
// Since we're using @googlemaps/js-api-loader, we need to declare these types

declare namespace google.maps {
    class Map {
        constructor(mapDiv: Element, opts?: MapOptions);
        setCenter(latLng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        fitBounds(bounds: LatLngBounds): void;
    }

    class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
        setPosition(latLng: LatLng | LatLngLiteral): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
        getPosition(): LatLng;
        setAnimation(animation: any): void;
        setTitle(title: string): void;
    }

    class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(map?: Map, anchor?: Marker): void;
        close(): void;
        setContent(content: string | Element): void;
    }

    class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
    }

    class LatLngBounds {
        constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
        extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
    }

    interface Animation {
        DROP: number;
        BOUNCE: number;
    }

    const Animation: Animation;

    interface MapsEventListener {
        remove(): void;
    }

    interface MapOptions {
        center?: LatLng | LatLngLiteral;
        clickableIcons?: boolean;
        disableDefaultUI?: boolean;
        disableDoubleClickZoom?: boolean;
        draggable?: boolean;
        draggableCursor?: string;
        fullscreenControl?: boolean;
        gestureHandling?: string;
        mapTypeControl?: boolean;
        mapTypeId?: string;
        maxZoom?: number;
        minZoom?: number;
        rotateControl?: boolean;
        scaleControl?: boolean;
        scrollwheel?: boolean;
        streetViewControl?: boolean;
        styles?: any[];
        zoom?: number;
        zoomControl?: boolean;
        mapId?: string;
    }

    interface MarkerOptions {
        animation?: number;
        clickable?: boolean;
        cursor?: string;
        draggable?: boolean;
        icon?: string | Icon | Symbol;
        map?: Map;
        opacity?: number;
        position: LatLng | LatLngLiteral;
        title?: string;
        visible?: boolean;
    }

    interface InfoWindowOptions {
        content?: string | Element;
        disableAutoPan?: boolean;
        maxWidth?: number;
        position?: LatLng | LatLngLiteral;
    }

    interface LatLngLiteral {
        lat: number;
        lng: number;
    }

    interface Icon {
        url: string;
        size?: Size;
        origin?: Point;
        anchor?: Point;
        scaledSize?: Size;
        labelOrigin?: Point;
    }

    class Size {
        constructor(width: number, height: number);
        width: number;
        height: number;
    }

    class Point {
        constructor(x: number, y: number);
        x: number;
        y: number;
    }

    class Symbol {
        constructor(options: SymbolOptions);
    }

    interface SymbolOptions {
        path: string;
        fillColor?: string;
        fillOpacity?: number;
        scale?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
    }
} 