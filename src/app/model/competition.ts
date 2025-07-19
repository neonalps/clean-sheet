import { ExternalProvider } from "./external-provider";

export interface SmallCompetition {
    id: number;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    parent?: SmallCompetition;
}

export interface CompetitionInput {
    competitionId?: number;
    externalCompetition?: ExternalCompetition;
}

export interface ExternalCompetition {
    provider: ExternalProvider;
    id: string;
    name: string;
    shortName: string;
}