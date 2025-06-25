import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DetailedPerson } from "@src/app/model/person";
import { PlayerSeasonStatsItemDto } from "@src/app/model/stats";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type GetPersonByIdResponse = {
  person: DetailedPerson;
  stats?: {
    performance: Array<PlayerSeasonStatsItemDto>;
  }
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