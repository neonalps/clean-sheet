import { DetailedGame } from "./game";
import { PerformanceTrend } from "./stats";

export interface DashboardResponse {
    lastGame?: DetailedGame;
    upcomingGame?: DetailedGame;
    performanceTrend?: PerformanceTrend;
}