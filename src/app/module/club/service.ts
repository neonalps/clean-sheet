import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BasicClub } from '@src/app/model/club';
import { ExternalProviderLinkDto } from '@src/app/model/external-provider';
import { BasicGame } from '@src/app/model/game';
import { ClubId, VenueFlavorId } from '@src/app/util/domain-types';
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

export type UpdateClub = {
  name: string;
  shortName: string;
  city: string;
  countryCode: string;
  primaryColour?: string;
  secondaryColour?: string;
  homeVenueFlavorId: VenueFlavorId;
};

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private readonly http = inject(HttpClient);

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

  updateById(clubId: ClubId, update: UpdateClub): Observable<BasicClub> {
    return this.http.put<BasicClub>(`${environment.apiBaseUrl}/v1/clubs/${clubId}`, update);
  }

  uploadAvatarFile(clubId: ClubId, file: File): Observable<BasicClub> {
    const form = new FormData();
    form.append('avatar', file);

    return this.http.put<BasicClub>(`${environment.apiBaseUrl}/v1/clubs/${clubId}/avatar`, form);
  }

  removeAvatar(clubId: ClubId): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/v1/clubs/${clubId}/avatar`);
  }

}
