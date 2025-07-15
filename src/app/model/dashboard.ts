import { BasicGame } from "./game";
import { PerformanceTrend } from "./stats";

export interface DashboardResponse {
    lastGame?: BasicGame;
    upcomingGame?: BasicGame;
    performanceTrend?: PerformanceTrend;
}