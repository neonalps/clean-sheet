import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PotentialGameAbsence } from "@src/app/model/game";
import { GameId } from "@src/app/util/domain-types";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type PotentialGameAbsenceResponse = {
    potential: PotentialGameAbsence[];
}

@Injectable({
  providedIn: 'root'
})
export class GameAbsenceService {

    private readonly http = inject(HttpClient);

    getPotentialAbsencesForGame(gameId: GameId): Observable<PotentialGameAbsenceResponse> {
        return this.http.get<PotentialGameAbsenceResponse>(`${environment.apiBaseUrl}/v1/games/${gameId}/potential-absences`);
    }

}