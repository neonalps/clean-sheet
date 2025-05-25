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
}

export enum ExternalSearchEntity {
    Club = "club",
    Competition = "competition",
    Game = "game",
    Person = "person",
    Season = "season",
    Venue = "venue",
}