import { DetailedGame } from "./game";

export interface DashboardResponse {
    lastGame?: DetailedGame;
    upcomingGame?: DetailedGame;
}