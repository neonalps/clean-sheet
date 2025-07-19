import { ExternalProvider } from "./external-provider";

export interface GameVenue {
    id: number;
    branding: string;
    city: string;
}

export interface BasicVenue {
    id: number;
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    capacity?: number;
    latitude?: number;
    longitude?: number;
}

export interface VenueInput {
    venueId?: number;
    externalVenue?: ExternalVenue;
}

export interface ExternalVenue {
    provider: ExternalProvider;
    id: string;
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    capacity: number;
    latitude?: number;
    longitude?: number;
}