import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatchdayDetails } from "@src/app/model/game";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MatchdayDetailsService {

  constructor(private http: HttpClient) { }

  getForGame(gameId: number): Observable<MatchdayDetails> {
    return this.http.get<MatchdayDetails>(`${environment.apiBaseUrl}/v1/games/${gameId}/matchday-details`);
  }
}