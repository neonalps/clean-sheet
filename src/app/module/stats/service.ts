import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RankedPersonItem } from "@src/app/model/dashboard";
import { PaginatedResponse, PaginationQueryParams } from "@src/app/model/pagination";
import { ShirtWornBy } from "@src/app/model/stats";
import { isDefined, isNotDefined } from "@src/app/util/common";
import { ClubId, CompetitionId, SeasonId, Shirt } from "@src/app/util/domain-types";
import { convertObjectToQueryString } from "@src/app/util/router";
import { Nullish } from "@src/app/util/types";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export interface PlayerStatsResponse extends PaginatedResponse<RankedPersonItem> {}

interface GetPlayerStatsRequest extends PaginationQueryParams {
    forMain?: boolean;
    competitions?: string,
    seasons?: string,
    opponents?: string,
}

export type GetPlayerStatsQueryParams = {
    forMain: boolean;
    competitionIds?: Array<CompetitionId>;
    opponentIds?: Array<ClubId>;
    seasonIds?: Array<SeasonId>;
}

export interface GetShirtStatsRequest {
    shirt: Shirt;
    sortMode?: ShirtWornBySortMode;
}

export interface GetShirtStatsResponse {
    wornBy: Array<ShirtWornBy>;
}

export type ShirtWornBySortMode = 'temporal' | 'frequency';

@Injectable({
    providedIn: 'root'
})
export class StatsService {

    constructor(private readonly http: HttpClient) {}

    getPlayerAppearanceStats(nextPageKey: Nullish<string>, params: Nullish<GetPlayerStatsQueryParams>): Observable<PlayerStatsResponse> {
        const queryParams = this.resolveQueryParams(nextPageKey, params);

        return this.http.get<PlayerStatsResponse>(`${environment.apiBaseUrl}/v1/stats/player-appearances?${convertObjectToQueryString(queryParams)}`);
    }

    getPlayerGoalStats(nextPageKey: Nullish<string>, params: Nullish<GetPlayerStatsQueryParams>): Observable<PlayerStatsResponse> {
        const queryParams = this.resolveQueryParams(nextPageKey, params);

        return this.http.get<PlayerStatsResponse>(`${environment.apiBaseUrl}/v1/stats/player-goals?${convertObjectToQueryString(queryParams)}`);
    }

    getPlayerYellowCardStats(nextPageKey: Nullish<string>, params: Nullish<GetPlayerStatsQueryParams>): Observable<PlayerStatsResponse> {
        const queryParams = this.resolveQueryParams(nextPageKey, params);

        return this.http.get<PlayerStatsResponse>(`${environment.apiBaseUrl}/v1/stats/player-yellow-cards?${convertObjectToQueryString(queryParams)}`);
    }

    getPlayerYellowRedCardStats(nextPageKey: Nullish<string>, params: Nullish<GetPlayerStatsQueryParams>): Observable<PlayerStatsResponse> {
        const queryParams = this.resolveQueryParams(nextPageKey, params);

        return this.http.get<PlayerStatsResponse>(`${environment.apiBaseUrl}/v1/stats/player-yellow-red-cards?${convertObjectToQueryString(queryParams)}`);
    }

    getPlayerRedCardStats(nextPageKey: Nullish<string>, params: Nullish<GetPlayerStatsQueryParams>): Observable<PlayerStatsResponse> {
        const queryParams = this.resolveQueryParams(nextPageKey, params);

        return this.http.get<PlayerStatsResponse>(`${environment.apiBaseUrl}/v1/stats/player-red-cards?${convertObjectToQueryString(queryParams)}`);
    }

    getShirtStats(shirt: number, sortMode: ShirtWornBySortMode): Observable<GetShirtStatsResponse> {
        const queryParams: GetShirtStatsRequest = { shirt, sortMode };
        
        return this.http.get<GetShirtStatsResponse>(`${environment.apiBaseUrl}/v1/stats/shirt?${convertObjectToQueryString(queryParams)}`);
    }

    private resolveQueryParams(nextPageKey: Nullish<string>, params: Nullish<GetPlayerStatsQueryParams>): GetPlayerStatsRequest {
        if (isDefined(nextPageKey)) {
            return { nextPageKey };
        }

        if (isNotDefined(params)) {
            throw new Error(`If no nextPageKey is passed then params must be defined`);
        }

        const request: GetPlayerStatsRequest = {
            forMain: params.forMain,
        };

        if (isDefined(params.competitionIds)) {
            request.competitions = params.competitionIds.join(',');
        }

        if (isDefined(params.seasonIds)) {
            request.seasons = params.seasonIds.join(',');
        }

        if (isDefined(params.opponentIds)) {
            request.opponents = params.opponentIds.join(',');
        }

        return request;
    }

}