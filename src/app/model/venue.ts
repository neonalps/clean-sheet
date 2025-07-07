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