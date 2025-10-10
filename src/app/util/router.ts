import { Router } from "@angular/router";
import { DetailedGame } from "@src/app/model/game";
import { ClubId, CompetitionId, GameId, PersonId, SeasonId, VenueId } from "./domain-types";

export const PATH_PARAM_CLUB_ID = "clubId";
export const PATH_PARAM_COMPETITION_ID = "competitionId";
export const PATH_PARAM_GAME_ID = "gameId";
export const PATH_PARAM_PERSON_ID = "personId";
export const PATH_PARAM_SEASON_ID = "seasonId";
export const PATH_PARAM_VENUE_ID = "venueId";
export const PATH_PARAM_OAUTH_PROVIDER = "provider";

export function navigateToSeasonGames(router: Router, seasonId: SeasonId): void {
    router.navigate(["/season", seasonId, "games"]);
}

export function navigateToSeasonSquad(router: Router, seasonId: SeasonId): void {
    router.navigate(["/season", seasonId, "squad"]);
}

export function navigateToClub(router: Router, clubId: ClubId): void {
    router.navigate(["/club", clubId]);
}

export function navigateToCompetition(router: Router, competitionId: CompetitionId): void {
    router.navigate(["/competition", competitionId]);
}

export function navigateToGame(router: Router, game: DetailedGame): void {
    router.navigate(["/game", game.id], { state: { game } } );
}

export function navigateToModifyGame(router: Router, gameId: GameId): void {
    router.navigate(["/game", gameId, "edit"],);
}

export function navigateToGameWithoutDetails(router: Router, gameId: GameId, seasonId?: number): void {
    router.navigate(["/game", gameId], { state: { seasonId: seasonId } } );
}

export function navigateToPerson(router: Router, personId: PersonId): void {
    router.navigate(["/person", personId]);
}

export function navigateToVenue(router: Router, venueId: VenueId): void {
    router.navigate(["/venue", venueId]);
}

export function navigateToSettings(router: Router): void {
    router.navigate(["/settings"]);
}

export function navigateToLogout(router: Router): void {
    router.navigate(["/logout"]);
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