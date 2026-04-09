import { CompetitionId } from "@src/app/util/domain-types";
import { ExternalProvider } from "./external-provider";

export interface SmallCompetition {
    id: CompetitionId;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    parent?: SmallCompetition;
}

export interface Competition {
    id: CompetitionId;
    name: string;
    shortName: string;
    isDomestic: boolean;
    parent?: Competition;
    iconSmall?: string;
    iconLarge?: string;
    combineStatisticsWithParent?: boolean;
}

export interface BasicCompetition {
    id: CompetitionId;
    name: string;
    shortName: string;
    isDomestic: boolean;
    parentCompetitionId?: CompetitionId;
    iconSmall?: string;
    iconLarge?: string;
    combineStatisticsWithParent?: boolean;
    sortOrder: number;
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