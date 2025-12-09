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

export interface LeaseTerms {
  minLeaseDuration: number;
  maxOccupants: number;
  petsAllowed: boolean;
  securityDeposit: number;
  availableFrom: string;
}

export interface PreferredTenants {
  noSmoking?: boolean;
  noPets?: boolean;
  backgroundCheck?: boolean;
  creditCheck?: boolean;
  incomeVerification?: boolean;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  imageUrls: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  features: string[];
  status: string;
  leaseTerms: LeaseTerms;
  preferredTenants: PreferredTenants;
}

export interface Listing extends CreateListingRequest {
  id: number;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}
