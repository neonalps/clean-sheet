import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RankedPersonItem } from "@src/app/model/dashboard";
import { PaginatedResponse, PaginationQueryParams } from "@src/app/model/pagination";
import { isDefined } from "@src/app/util/common";
import { ClubId, CompetitionId, SeasonId } from "@src/app/util/domain-types";
import { convertObjectToQueryString } from "@src/app/util/router";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export interface GetPlayerAppearanceStatsResponse extends PaginatedResponse<RankedPersonItem> {}

interface GetPlayerAppearancesRequest extends PaginationQueryParams {
    forMain: boolean;
    competitions?: string,
    seasons?: string,
    opponents?: string,
}

export type GetPlayerAppearanceQueryParams = {
    forMain: boolean;
    competitionIds?: Array<CompetitionId>;
    opponentIds?: Array<ClubId>;
    seasonIds?: Array<SeasonId>;
}

@Injectable({
    providedIn: 'root'
})
export class StatsService {

    constructor(private http: HttpClient) {}

    getPlayerAppearanceStats(params: GetPlayerAppearanceQueryParams): Observable<GetPlayerAppearanceStatsResponse> {
        const request: GetPlayerAppearancesRequest = {
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

        return this.http.get<GetPlayerAppearanceStatsResponse>(`${environment.apiBaseUrl}/v1/stats/player-appearances?${convertObjectToQueryString(request)}`);
    }

}