import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateGame, DetailedGame, GameStatus, ImportGameResponse, Tendency, UpdateGame, UserBasicGame } from '@src/app/model/game';
import { PaginatedResponse, PaginationQueryParams } from '@src/app/model/pagination';
import { GameId } from '@src/app/util/domain-types';
import { convertDtoToQueryString } from '@src/app/util/router';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

export interface GetGamesRequest extends PaginationQueryParams {
    competitionId?: string;
    opponentId?: string;
    seasonId?: string;
    tendency?: Tendency;
    status?: GameStatus;
    isHomeGame?: boolean;
    isNeutralGround?: boolean;
    hasAccountAttended?: boolean;
    hasAccountStarred?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) {}

  create(game: CreateGame): Observable<DetailedGame> {
    return this.http.post<DetailedGame>(`${environment.apiBaseUrl}/v1/games`, game);
  }

  update(gameId: GameId, update: UpdateGame): Observable<DetailedGame> {
    return this.http.post<DetailedGame>(`${environment.apiBaseUrl}/v1/games/${gameId}`, update);
  }

  delete(gameId: GameId): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/v1/games/${gameId}`);
  }

  getById(gameId: GameId): Observable<DetailedGame> {
    return this.http.get<DetailedGame>(`${environment.apiBaseUrl}/v1/games/${gameId}`);
  }

  getPaginated(request?: GetGamesRequest): Observable<PaginatedResponse<UserBasicGame>> {
    const query = request ? `?${convertDtoToQueryString(request as Record<string, unknown>)}` : '';
    return this.http.get<PaginatedResponse<UserBasicGame>>(`${environment.apiBaseUrl}/v1/games${query}`);
  }

  import(gameId: GameId): Observable<ImportGameResponse> {
      return this.http.post<ImportGameResponse>(`${environment.apiBaseUrl}/v1/ops/import-game`, { gameId });
  }

  star(gameId: GameId): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/v1/games/${gameId}/star`, {});
  }

  unstar(gameId: GameId): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/v1/games/${gameId}/star`, {});
  }

  attend(gameId: GameId): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/v1/games/${gameId}/attend`, {});
  }

  unattend(gameId: GameId): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/v1/games/${gameId}/attend`, {});
  }
}
