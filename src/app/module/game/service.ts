import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateGame, DetailedGame, ImportGameResponse } from '@src/app/model/game';
import { GameId } from '@src/app/util/domain-types';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  create(game: CreateGame): Observable<DetailedGame> {
    return this.http.post<DetailedGame>(`${environment.apiBaseUrl}/v1/games`, game);
  }

  getById(gameId: GameId): Observable<DetailedGame> {
      return this.http.get<DetailedGame>(`${environment.apiBaseUrl}/v1/games/${gameId}`);
  }

  import(gameId: GameId): Observable<ImportGameResponse> {
      return this.http.post<ImportGameResponse>(`${environment.apiBaseUrl}/v1/ops/import-game`, { gameId });
  }
}
