import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OverallPosition, SquadMember } from "@src/app/model/squad";
import { SeasonId } from "@src/app/util/domain-types";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type GetSeasonSquadResponse = {
  squad: Record<OverallPosition, Array<SquadMember>>;
}

@Injectable({
    providedIn: 'root'
})
export class SeasonSquadService {

    constructor(private http: HttpClient) { }

    getSquadBySeasonId(seasonId: SeasonId): Observable<GetSeasonSquadResponse> {
        return this.http.get<GetSeasonSquadResponse>(`${environment.apiBaseUrl}/v1/seasons/${seasonId}/squad`);
    }

}