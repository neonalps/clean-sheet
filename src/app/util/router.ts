import { Router } from "@angular/router";
import { DetailedGame } from "@src/app/model/game";

export const PATH_PARAM_GAME_ID = "gameId";
export const PATH_PARAM_SEASON_ID = "seasonId";

export function navigateToSeasonGames(router: Router, seasonId: number): void {
    router.navigate(["/season", seasonId, "games"]);
}

export function navigateToGame(router: Router, game: DetailedGame): void {
    
    router.navigate(["/game", game.id], { state: { game } } );
}