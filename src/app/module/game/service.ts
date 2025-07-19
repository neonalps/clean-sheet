import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateGame, DetailedGame } from '@src/app/model/game';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  create(game: CreateGame): Observable<DetailedGame> {
    throw new Error();
  }

  getById(gameId: number): Observable<DetailedGame> {
      return this.http.get<DetailedGame>(`${environment.apiBaseUrl}/v1/games/${gameId}`);
  }
}
