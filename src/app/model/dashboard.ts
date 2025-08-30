import { SmallCompetition } from "./competition";
import { BasicGame } from "./game";
import { Person } from "./person";
import { PerformanceTrend } from "./stats";

export interface PlayerCompetitionItem {
    rank: number;
    player: Person;
    value: number;
}

export interface PlayerCompetitionStats {
    competitions: SmallCompetition[];
    ranking: PlayerCompetitionItem[];
}

export interface DashboardResponse {
    lastGame?: BasicGame;
    upcomingGame?: BasicGame;
    performanceTrend?: PerformanceTrend;
    topScorers?: PlayerCompetitionStats;
}