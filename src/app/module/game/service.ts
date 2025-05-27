import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetailedGame } from '@src/app/model/game';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  getById(gameId: number): Observable<DetailedGame> {
      return this.http.get<DetailedGame>(`${environment.apiBaseUrl}/v1/games/${gameId}`);
  }
}
