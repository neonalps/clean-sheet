import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicClub } from '@src/app/model/club';
import { convertSearchParamsToQueryString } from '@src/app/util/router';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  getById(clubId: number, includeLastGames?: boolean): Observable<BasicClub> {
      const params = new URLSearchParams();
      if (includeLastGames) {
        params.set('includeLastGames', 'true');
      }
      return this.http.get<BasicClub>(`${environment.apiBaseUrl}/v1/clubs/${clubId}${convertSearchParamsToQueryString(params)}`);
  }
}
