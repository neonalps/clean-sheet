import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GameAbsenceType, PotentialGameAbsence } from "@src/app/model/game";
import { GameId, PersonId } from "@src/app/util/domain-types";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type PotentialGameAbsenceResponse = {
    potential: PotentialGameAbsence[];
}

export type StoreGameAbsence = {
    personId: PersonId;
    absenceType: GameAbsenceType;
    absenceReason: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameAbsenceService {

    private readonly http = inject(HttpClient);

    getPotentialAbsencesForGame(gameId: GameId): Observable<PotentialGameAbsenceResponse> {
        return this.http.get<PotentialGameAbsenceResponse>(`${environment.apiBaseUrl}/v1/games/${gameId}/potential-absences`);
    }

    storeAbsencesForGame(gameId: GameId, absences: PotentialGameAbsence[]): Observable<void> {
        const storeAbsenceDtos: StoreGameAbsence[] = absences.map(item => ({ personId: item.person.id, absenceReason: item.reason, absenceType: item.type }));

        return this.http.put<void>(`${environment.apiBaseUrl}/v1/games/${gameId}/absences`, {
            absences: storeAbsenceDtos,
        });
    }

}