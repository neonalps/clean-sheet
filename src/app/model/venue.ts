import { VenueFlavorId, VenueId } from "@src/app/util/domain-types";
import { ExternalProvider } from "./external-provider";

export interface GameVenue {
    id: VenueId;
    flavorId: VenueFlavorId;
    branding: string;
    city: string;
}

export interface BasicVenue {
    id: VenueId;
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    capacity?: number;
    latitude?: number;
    longitude?: number;
    flavors: VenueFlavor[];
}

export interface VenueFlavor {
    id: VenueFlavorId;
    name: string;
}

export interface VenueInput {
    venueFlavorId?: VenueFlavorId;
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