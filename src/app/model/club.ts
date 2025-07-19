import { ExternalProvider } from "./external-provider";
import { BasicGame } from "./game";
import { BasicVenue, VenueInput } from "./venue";

export interface SmallClub {
    id: number;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
}

export interface BasicClub {
    id: number;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    primaryColour?: string;
    secondaryColour?: string;
    city: string;
    district?: string;
    countryCode: string;
    homeVenue?: BasicVenue;
    lastGames?: BasicGame[];
}

export interface ClubInput {
    clubId?: number;
    externalClub?: ExternalClub;
}

export interface ExternalClub {
    provider: ExternalProvider;
    id: string;
    name: string;
    shortName: string;
    iconLarge?: string;
    iconSmall?: string;
    city: string;
    district?: string;
    countryCode: string;
    primaryColour?: string;
    secondaryColour?: string;
    homeVenue?: VenueInput;
}