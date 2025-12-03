import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ExternalProviderLinkDto } from "@src/app/model/external-provider";
import { BasicGame } from "@src/app/model/game";
import { DetailedPerson, Person } from "@src/app/model/person";
import { GoalsAgainstClubStatsItemDto, PlayerBaseStats, PlayerSeasonStatsItemDto } from "@src/app/model/stats";
import { DateString } from "@src/app/util/domain-types";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type CreatePersonRequest = {
  lastName: string;
  firstName?: string;
  avatar?: string;
  birthday?: DateString;
  deathday?: DateString;
  nationalities?: string[];
};

export type GetPersonByIdResponse = {
  person: DetailedPerson;
  stats?: {
    performance: Array<PlayerSeasonStatsItemDto>;
    goalsAgainstClubs: Array<GoalsAgainstClubStatsItemDto>;
    refereeGames?: Array<BasicGame>;
    opponent?: PlayerBaseStats;
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

    create(createPerson: CreatePersonRequest): Observable<Person> {
      return this.http.post<Person>(`${environment.apiBaseUrl}/v1/people`, createPerson);
    }

}