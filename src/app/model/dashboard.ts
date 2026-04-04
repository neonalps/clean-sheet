import { SmallCompetition } from "./competition";
import { BasicGame } from "./game";
import { Person } from "./person";
import { PerformanceTrend } from "./stats";

export interface RankedPersonItem {
    rank: number;
    person: Person;
    value: number;
}

export interface PlayerCompetitionStats {
    competitions: SmallCompetition[];
    ranking: RankedPersonItem[];
}

export interface DashboardResponse {
    lastGame?: BasicGame;
    upcomingGame?: BasicGame;
    performanceTrend?: PerformanceTrend;
    topScorers?: PlayerCompetitionStats;
}