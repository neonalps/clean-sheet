import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicClub } from '@src/app/model/club';
import { ExternalProviderLinkDto } from '@src/app/model/external-provider';
import { BasicGame } from '@src/app/model/game';
import { convertSearchParamsToQueryString } from '@src/app/util/router';
import { OmitStrict } from '@src/app/util/types';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

export interface GetClubByIdResponse {
  club: BasicClub;
  allGames?: OmitStrict<BasicGame, 'opponent'>[];
  lastGames?: OmitStrict<BasicGame, 'opponent'>[];
  externalLinks?: ReadonlyArray<ExternalProviderLinkDto>;
}

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  getById(clubId: number, includeLastGames?: boolean, includeAllGames?: boolean): Observable<GetClubByIdResponse> {
      const params = new URLSearchParams();
      if (includeLastGames) {
        params.set('includeLastGames', 'true');
      }
      if (includeAllGames) {
        params.set('includeAllGames', 'true');
      }
      return this.http.get<GetClubByIdResponse>(`${environment.apiBaseUrl}/v1/clubs/${clubId}${convertSearchParamsToQueryString(params)}`);
  }
}
