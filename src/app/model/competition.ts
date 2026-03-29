import { ExternalProvider } from "./external-provider";

export interface SmallCompetition {
    id: number;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    parent?: SmallCompetition;
}

export interface Competition {
    id: number;
    name: string;
    shortName: string;
    isDomestic: boolean;
    parent?: Competition;
    iconSmall?: string;
    iconLarge?: string;
    combineStatisticsWithParent?: boolean;
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