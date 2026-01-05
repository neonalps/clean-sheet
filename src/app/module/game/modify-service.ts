import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { ClubId, CompetitionId, DateString, GameId, PersonId, VenueId } from "@src/app/util/domain-types";
import { GameService } from "./service";
import { map, Observable, of, Subject, tap } from "rxjs";
import { UiIconDescriptor } from "@src/app/model/icon";
import { DetailedGame, GameStatus, RefereeRole, UpdateGame } from "@src/app/model/game";
import { ensureNotNullish } from "@src/app/util/common";
import { getPersonName } from "@src/app/util/domain";

export type ModifyGameInput = {
    id?: GameId;
    kickoff?: DateString;
    status?: GameStatus;
    opponentId?: ClubId;
    opponentIcon?: UiIconDescriptor;
    opponentName?: string;
    competitionId?: CompetitionId;
    competitionIcon?: UiIconDescriptor;
    competitionName?: string;
    competitionRound?: string;
    competitionStage?: string;
    venueId?: VenueId;
    venueName?: string;
    isHomeGame?: boolean;
    isNeutralGround?: boolean;
    isSoldOut?: boolean;
    attendance?: number;
    leg?: number;
    previousLeg?: GameId;
    refereeId?: PersonId;
    refereeName?: string;
    refereeIcon?: UiIconDescriptor;
}

@Injectable({
  providedIn: 'root'
})
export class ModifyGameService implements OnDestroy {

  private readonly gameService = inject(GameService);

  private readonly currentModifyInput = signal<ModifyGameInput | null>(null);

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  newGame(): Observable<ModifyGameInput> {
    return this.getModifyGameInput(null)
      .pipe(
        // TODO store in local storage?
        tap(input => this.currentModifyInput.set(input))
      );
  }

  editGame(gameId: GameId): Observable<ModifyGameInput> {
    return this.getModifyGameInput(gameId)
      .pipe(
        // TODO store in local storage?
        tap(input => this.currentModifyInput.set(input))
      );
  }

  submitGame(): Observable<DetailedGame> {
    const currentInputValue = this.currentModifyInput();
    if (currentInputValue === null) {
      throw new Error(`Nothing to submit`);
    }

    const baseGameInformation = this.toUpdateGame(currentInputValue);

    const existingGameId = currentInputValue.id;

    const modifyRequestObservable = existingGameId ? this.gameService.update(existingGameId, baseGameInformation) : this.gameService.create({
        ...baseGameInformation,
        // TODO change
        lineupMain: [],
        lineupOpponent: [],
        managersMain: [],
        managersOpponent: [],
        referees: [],
        events: [],
      });

    return modifyRequestObservable.pipe(
      tap(() => {
        this.currentModifyInput.set(null);
      }),
    );
  }

  private getModifyGameInput(gameId: GameId | null): Observable<ModifyGameInput> {
    if (gameId === null) {
      return of({});
    }

    return this.gameService.getById(gameId)
      .pipe(
        map(response => {
          console.log('got response', response);

          const referee = response.report.referees.find(item => item.role === RefereeRole.Referee);

          return {
            id: response.id,
            kickoff: response.kickoff,
            opponentId: response.opponent.id,
            opponentName: response.opponent.name,
            opponentIcon: response.opponent.iconSmall ? {
              type: 'club',
              content: response.opponent.iconSmall,
            } : undefined,
            status: response.status,
            competitionId: response.competition.id,
            competitionName: response.competition.name,
            competitionIcon: response.competition.iconSmall ? {
              type: 'competition',
              content: response.competition.iconSmall,
            } : undefined,
            competitionRound: response.round,
            competitionStage: response.stage,
            venueId: response.venue.id,
            venueName: response.venue.branding,
            attendance: response.attendance,
            isHomeGame: response.isHomeGame,
            isSoldOut: response.isSoldOut,
            refereeId: referee?.id,
            refereeName: referee ? getPersonName(referee.person) : undefined,
            refereeIcon: referee ? { type: 'person', content: referee.person.avatar } : undefined,
          };
        }),
      );
  }

  private toUpdateGame(input: ModifyGameInput): UpdateGame {
    return {
      kickoff: ensureNotNullish(input.kickoff),
      opponent: {
        clubId: ensureNotNullish(input.opponentId),
      },
      competition: {
        competitionId: ensureNotNullish(input.competitionId),
      },
      competitionRound: ensureNotNullish(input.competitionRound),
      competitionStage: input.competitionStage,
      isHomeGame: ensureNotNullish(input.isHomeGame),
      isSoldOut: ensureNotNullish(input.isSoldOut),
      status: ensureNotNullish(input.status),
      attendance: input.attendance,
      venue: {
        venueId: ensureNotNullish(input.venueId),
      },
      leg: input.leg,
      previousLeg: input.previousLeg ? { gameId: input.previousLeg } : undefined,
    }
  }

}