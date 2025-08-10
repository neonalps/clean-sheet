import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BasicGame } from "@src/app/model/game";
import { GamePlayedFilterOptions } from "@src/app/model/game-played";
import { PaginatedResponse } from "@src/app/model/pagination";
import { convertDtoToQueryString } from "@src/app/util/router";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type GetPlayerGamesPlayedResponse = {
  game: BasicGame;
  starting?: boolean;
  captain?: boolean;
  shirt?: number;
  minutesPlayed?: number;
  goalsScored?: number;
  assists?: number;
  ownGoals?: number;
  goalsConceded?: number;
  regulationPenaltiesTaken?: [number, number];
  regulationPenaltiesFaced?: [number, number];
  psoPenaltiesTaken?: [number, number];
  psoPenaltiesFaced?: [number, number];
  yellowCard?: boolean;
  yellowRedCard?: boolean;
  redCard?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GamesPlayedService {

    constructor(private http: HttpClient) { }

    getForPlayer(personId: number, filterOptions?: GamePlayedFilterOptions): Observable<PaginatedResponse<GetPlayerGamesPlayedResponse>> {
      const query = filterOptions ? `?${convertDtoToQueryString(filterOptions)}` : '';
      return this.http.get<PaginatedResponse<GetPlayerGamesPlayedResponse>>(`${environment.apiBaseUrl}/v1/people/${personId}/games-played${query}`);
    }

}