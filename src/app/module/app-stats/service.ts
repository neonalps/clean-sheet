import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export interface ApplicationStats {
    accountCount: number;
    gameCount: number;
    personCount: number;
    gameEventCount: number;
    gamePlayerCount: number;
    gameManagerCount: number;
    gameRefereeCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationStatsService {

    constructor(private readonly http: HttpClient) {}

    getAppStats(): Observable<ApplicationStats> {
      return this.http.get<ApplicationStats>(`${environment.apiBaseUrl}/v1/stats/application`);
    }

}