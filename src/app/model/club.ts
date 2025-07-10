import { BasicGame, DetailedGame } from "./game";
import { BasicVenue } from "./venue";

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