import { Router } from "@angular/router";
import { BasicGame, DetailedGame } from "@src/app/model/game";

export const PATH_PARAM_CLUB_ID = "clubId";
export const PATH_PARAM_GAME_ID = "gameId";
export const PATH_PARAM_PERSON_ID = "personId";
export const PATH_PARAM_SEASON_ID = "seasonId";

export function navigateToSeasonGames(router: Router, seasonId: number): void {
    router.navigate(["/season", seasonId, "games"]);
}

export function navigateToClub(router: Router, clubId: number): void {
    router.navigate(["/club", clubId]);
}

export function navigateToGame(router: Router, game: DetailedGame): void {
    router.navigate(["/game", game.id], { state: { game } } );
}

export function navigateToGameWithoutDetails(router: Router, gameId: number, seasonId?: number): void {
    router.navigate(["/game", gameId], { state: { seasonId: seasonId } } );
}

export function navigateToPerson(router: Router, personId: number): void {
    router.navigate(["/person", personId]);
}

export function replaceHash(hash: string) {
    window.history.replaceState(null, '', `${window.location.origin}${window.location.pathname}#${hash}`);
}

export function convertSearchParamsToQueryString(params: URLSearchParams): string {
    if (params.size === 0) {
        return '';
    }

    return `?${params.toString()}`;
}

export function convertDtoToQueryString(dto: Record<string, unknown>): string {
    const params = new URLSearchParams();

    for (const property in dto) {
        const value = dto[property];
        params.set(property, typeof value === 'string' ? value : (value as any).toString());
    }

    return params.toString();
}