import { DateString } from "@src/app/util/domain-types";
import { BasicClub } from "./club";

export interface ExternalSearchResponseDto {
    items: ExternalSearchResultItemDto[];
}

export interface ExternalSearchResultItemDto {
    type: ExternalSearchEntity,
    entityId: number;
    icon?: string;
    title: string;
    sub?: string;
    popularity?: number;
    context?: unknown;
}

export enum ExternalSearchEntity {
    Club = "club",
    Competition = "competition",
    Game = "game",
    Person = "person",
    Season = "season",
    Venue = "venue",
}

export type GameResult = {
    fullTime: [number, number],
    halfTime: [number, number],
    afterExtraTime?: [number, number],
    penaltyShootOut?: [number, number],
};

export type GameSearchResultContext = {
    opponent: BasicClub;
    kickoff: DateString;
    isHomeGame: boolean;
    result?: GameResult;
};