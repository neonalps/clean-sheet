import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ExternalProviderLinkDto } from "@src/app/model/external-provider";
import { DetailedPerson } from "@src/app/model/person";
import { GoalsAgainstClubStatsItemDto, PlayerSeasonStatsItemDto } from "@src/app/model/stats";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type GetPersonByIdResponse = {
  person: DetailedPerson;
  stats?: {
    performance: Array<PlayerSeasonStatsItemDto>;
    goalsAgainstClubs: Array<GoalsAgainstClubStatsItemDto>;
  },
  externalLinks?: ReadonlyArray<ExternalProviderLinkDto>;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

    constructor(private http: HttpClient) { }

    getById(personId: number, includeStatistics: boolean = false): Observable<GetPersonByIdResponse> {
        return this.http.get<GetPersonByIdResponse>(`${environment.apiBaseUrl}/v1/people/${personId}?includeStatistics=${includeStatistics}`);
    }

}