import { CompetitionId, SeasonId } from "../util/domain-types";
import { SmallClub } from "./club";
import { SmallCompetition } from "./competition";
import { DetailedGame } from "./game";
import { Season } from "./season";

export type PlayerSeasonStatsItemDto = {
    season: Season;
    competitions: Array<PlayerCompetitionStatsItemDto>;
}

export type GoalsAgainstClubStatsItemDto = {
    club: SmallClub;
    goalsScored: number;
}

export type PlayerSubCompetitionStatsItemDto = {
    isParent?: boolean;
    competition?: SmallCompetition;
    stats: PlayerStatsItemDto;
}

export type PlayerCompetitionStatsItemDto = {
    competition: SmallCompetition;
    items: Array<PlayerSubCompetitionStatsItemDto>;
}

export type PlayerStatsItemDto = {
    gamesPlayed?: number;
    gamesStarted?: number;
    goalsScored?: number;
    assists?: number;
    minutesPlayed?: number;
    ownGoals?: number;
    goalsConceded?: number;
    cleanSheets?: number;
    yellowCards?: number;
    yellowRedCards?: number;
    redCards?: number;
    penaltiesTaken?: [number, number],
    penaltiesFaced?: [number, number],
    psoPenaltiesTaken?: [number, number],
    psoPenaltiesFaced?: [number, number],
}

export interface PlayerBaseStats {
    gamesPlayed: number;
    goalsScored: number;
    assists: number;
    ownGoals: number;
    goalsConceded: number;
    cleanSheets: number;
    minutesPlayed: number;
    gamesStarted: number;
    yellowCards: number;
    yellowRedCards: number;
    redCards: number;
    regulationPenaltiesTaken: number;
    regulationPenaltiesScored: number;
    regulationPenaltiesFaced: number;
    regulationPenaltiesSaved: number;
    psoPenaltiesTaken: number;
    psoPenaltiesScored: number;
    psoPenaltiesFaced: number;
    psoPenaltiesSaved: number;
}

export type SeasonCompetitionStats = {
    seasonId: number;
    
}

export type UiPlayerStats = {
    seasons: Season[];
    competitions: SmallCompetition[];
    overall: PlayerBaseStats;
    bySeasonAndCompetition: Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>;
    byCompetition: Map<CompetitionId, PlayerBaseStats>;
    //bySeason: Map<SeasonId, PlayerBaseStats>;
}

export interface PerformanceTrend {
    score: number;
    games: DetailedGame[];
}