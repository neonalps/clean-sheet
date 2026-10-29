import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ExternalProviderLinkDto } from "@src/app/model/external-provider";
import { BasicGame } from "@src/app/model/game";
import { ManagerPeriodForPerson } from "@src/app/model/manager";
import { DetailedPerson, Person } from "@src/app/model/person";
import { ContractForPerson } from "@src/app/model/person-contract";
import { GoalsAgainstClubStatsItemDto, PlayerBaseStats, PlayerSeasonStatsItemDto, ShirtDistributionItem } from "@src/app/model/stats";
import { DateString, PersonId } from "@src/app/util/domain-types";
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

export type UpdatePerson = {
  lastName: string;
  firstName?: string;
  birthday?: DateString;
  deathday?: DateString;
  nationalities?: string[];
};

export type GetPersonByIdResponse = {
  person: DetailedPerson;
  contract?: ContractForPerson;
  stats?: {
    performance: Array<PlayerSeasonStatsItemDto>;
    goalsAgainstClubs: Array<GoalsAgainstClubStatsItemDto>;
    refereeGames?: Array<BasicGame>;
    opponent?: PlayerBaseStats;
    shirtDistribution?: Array<ShirtDistributionItem>;
    managerPeriods?: Array<ManagerPeriodForPerson>;
  },
  externalLinks?: Array<ExternalProviderLinkDto>;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

    private readonly http = inject(HttpClient);

    getById(personId: PersonId, includeContract = false, includeStatistics: boolean = false): Observable<GetPersonByIdResponse> {
      return this.http.get<GetPersonByIdResponse>(`${environment.apiBaseUrl}/v1/people/${personId}?includeContract=${includeContract}&includeStatistics=${includeStatistics}`);
    }

    create(createPerson: CreatePersonRequest): Observable<Person> {
      return this.http.post<Person>(`${environment.apiBaseUrl}/v1/people`, createPerson);
    }

    updateById(personId: PersonId, update: UpdatePerson): Observable<Person> {
      return this.http.put<Person>(`${environment.apiBaseUrl}/v1/people/${personId}`, update);
    }

    uploadAvatarFile(personId: PersonId, file: File): Observable<Person> {
      const form = new FormData();
      form.append('avatar', file);

      return this.http.put<Person>(`${environment.apiBaseUrl}/v1/people/${personId}/avatar`, form);
    }

    removeAvatar(personId: PersonId): Observable<void> {
      return this.http.delete<void>(`${environment.apiBaseUrl}/v1/people/${personId}/avatar`);
    }

}