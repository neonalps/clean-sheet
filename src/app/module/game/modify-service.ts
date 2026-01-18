import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { ClubId, CompetitionId, DateString, GameId, PersonId, VenueId } from "@src/app/util/domain-types";
import { GameService } from "./service";
import { map, Observable, of, Subject, tap } from "rxjs";
import { UiIconDescriptor } from "@src/app/model/icon";
import { CreateGameEvent, CreateGameManager, CreateGamePlayer, CreateGameReferee, CreateGoalGameEvent, CreateInjuryTimeGameEvent, CreatePenaltyMissedGameEvent, CreatePenaltyShootOutGameEvent, CreateRedCardGameEvent, CreateSubstitutionGameEvent, CreateVarDecisionGameEvent, CreateYellowCardGameEvent, CreateYellowRedCardGameEvent, DetailedGame, GameEventType, GameStatus, ManagingRole, RefereeRole, UpdateGame } from "@src/app/model/game";
import { assertUnreachable, ensureNotNullish, isDefined } from "@src/app/util/common";
import { getPersonName } from "@src/app/util/domain";
import { ModifyGameLineup } from "@src/app/component/modify-game-lineups/modify-game-lineups.component";
import { EditorGameEvent, EditorGoalGameEvent, EditorInjuryTimeGameEvent, EditorPenaltyMissedGameEvent, EditorPsoGameEvent, EditorRedCardGameEvent, EditorSubstitutionGameEvent, EditorVarDecisionGameEvent, EditorYellowCardGameEvent, EditorYellowRedCardGameEvent } from "../game-event-editor/types";
import { LineupItem } from "@src/app/component/lineup-selector-person-item/lineup-selector-person-item.component";

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
    lineup?: ModifyGameLineup;
    events?: EditorGameEvent[];
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

  updateGameInput(updatedInput: ModifyGameInput) {
    const newGameInputValue = {
      ...this.currentModifyInput(),
      ...updatedInput,
    };

    this.currentModifyInput.set(newGameInputValue);
  }

  submitGame(): Observable<DetailedGame> {
    const currentInputValue = this.currentModifyInput();
    if (currentInputValue === null) {
      throw new Error(`Nothing to submit`);
    }

    console.log('to submit', currentInputValue);

    const gameInformation = this.toUpdateGame(currentInputValue);

    const existingGameId = currentInputValue.id;

    const referees: CreateGameReferee[] = [];
    // at the minute we only support the main referee
    if (currentInputValue.refereeId) {
      referees.push({
        person: { personId: currentInputValue.refereeId },
        role: RefereeRole.Referee,
        sortOrder: 0,
      })
    }

    const modifyRequestObservable = existingGameId ? this.gameService.update(existingGameId, {
      ...gameInformation,
      referees: referees,
    }) : this.gameService.create({
        ...gameInformation,
        referees: referees,
        lineupMain: gameInformation.lineupMain ?? [],
        lineupOpponent: gameInformation.lineupOpponent ?? [],
        managersMain: gameInformation.managersMain ?? [],
        managersOpponent: gameInformation.managersOpponent ?? [],
        events: gameInformation.events ?? [],
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
            refereeId: referee?.person.id,
            refereeName: referee ? getPersonName(referee.person) : undefined,
            refereeIcon: referee?.person.avatar ? { type: 'person', content: referee.person.avatar } : undefined,
          };
        }),
      );
  }

  private toUpdateGame(input: ModifyGameInput): UpdateGame {
    const lineupInformation = input.lineup ? this.convertGameLineup(input.lineup) : null;

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
      lineupMain: lineupInformation?.lineupMain,
      lineupOpponent: lineupInformation?.lineupOpponent,
      managersMain: lineupInformation?.managersMain,
      managersOpponent: lineupInformation?.managersOpponent,
      events: input.events && lineupInformation ?  this.convertGameEvents(input.events, lineupInformation) : undefined,
    };
  }

  private convertGameLineup(lineup: ModifyGameLineup): Pick<UpdateGame, 'lineupMain' | 'lineupOpponent' | 'managersMain' | 'managersOpponent'> {
    return {
      lineupMain: [
        ...lineup.mainStarting.map((item, idx) => this.convertPlayerLineupItem(item, idx, true, true)),
        ...lineup.mainSubstitutes.map((item, idx) => this.convertPlayerLineupItem(item, idx + 11, true, false)),
      ],
      lineupOpponent: [
        ...lineup.opponentStarting.map((item, idx) => this.convertPlayerLineupItem(item, idx + 100, false, true)),
        ...lineup.opponenSubstitutes.map((item, idx) => this.convertPlayerLineupItem(item, idx + 111, false, false)),
      ],
      managersMain: lineup.mainManagers.map((item, idx) => this.convertManagerLineupItem(item, idx, true)),
      managersOpponent: lineup.opponentManagers.map((item, idx) => this.convertManagerLineupItem(item, idx, false)),
    }
  }

  private convertPlayerLineupItem(item: LineupItem, sortOrder: number, forMain: boolean, isStarting: boolean): CreateGamePlayer {
    return {
      sortOrder,
      person: { personId: item.person.personId },
      shirt: item.shirt,
      isCaptain: item.isCaptain ?? false,
      forMain,
      isStarting,
    }
  }

  private convertManagerLineupItem(item: LineupItem, sortOrder: number, forMain: boolean): CreateGameManager {
    return {
      sortOrder,
      person: { personId: item.person.personId },
      forMain,
      role: ManagingRole.HeadCoach,
    }
  }

  private convertGameEvents(events: EditorGameEvent[], lineupInformation: Pick<UpdateGame, 'lineupMain' | 'lineupOpponent' | 'managersMain' | 'managersOpponent'>): CreateGameEvent[] {
    return events.map((item, idx) => {
      const gameEventType = ensureNotNullish(item.type);

      const baseEvent = {
        minute: item.minute,
        type: gameEventType,
        sortOrder: idx,
      };

      return this.convertGameEvent(gameEventType, item, baseEvent, lineupInformation);
    });
  }

  private convertGameEvent(gameEventType: GameEventType, item: EditorGameEvent, baseEvent: CreateGameEvent, lineupInformation: Pick<UpdateGame, 'lineupMain' | 'lineupOpponent' | 'managersMain' | 'managersOpponent'>) {
    switch (gameEventType) {
      case GameEventType.Goal:
        const goalItem = item as EditorGoalGameEvent;
        return {
          ...baseEvent,
          type: GameEventType.Goal,
          scoredBy: { personId: goalItem.scoredBy },
          assistBy: goalItem.assistBy ? { personId: goalItem.assistBy } : undefined,
          goalType: goalItem.goalType,
          ownGoal: goalItem.ownGoal ?? false,
          directFreeKick: goalItem.directFreeKick ?? false,
          penalty: goalItem.penalty ?? false,
          bicycleKick: false,   // TODO add?
        } satisfies CreateGoalGameEvent;
      case GameEventType.Substitution:
        const substitutionItem = item as EditorSubstitutionGameEvent;
        return {
          ...baseEvent,
          type: GameEventType.Substitution,
          playerOn: { personId: substitutionItem.playerOn },
          playerOff: { personId: substitutionItem.playerOff },
          injured: substitutionItem.injured,
        } satisfies CreateSubstitutionGameEvent;
      case GameEventType.YellowCard:
        const yellowCardItem = item as EditorYellowCardGameEvent;
        const affectedYellowCardPerson = ensureNotNullish(yellowCardItem.affectedPerson);
        const isYellowCardPlayer = this.isPersonPlayer(affectedYellowCardPerson, lineupInformation);
        return {
          ...baseEvent,
          type: GameEventType.YellowCard,
          affectedPlayer: isYellowCardPlayer ? { personId: affectedYellowCardPerson } : undefined,
          affectedManager: !isYellowCardPlayer ? { personId: affectedYellowCardPerson } : undefined,
          reason: yellowCardItem.reason,
          notOnPitch: yellowCardItem.notOnPitch,
        } satisfies CreateYellowCardGameEvent;
      case GameEventType.YellowRedCard:
        const yellowRedCardItem = item as EditorYellowRedCardGameEvent;
        const affectedYellowRedCardPerson = ensureNotNullish(yellowRedCardItem.affectedPerson);
        const isYellowRedCardPlayer = this.isPersonPlayer(affectedYellowRedCardPerson, lineupInformation);
        return {
          ...baseEvent,
          type: GameEventType.YellowRedCard,
          affectedPlayer: isYellowRedCardPlayer ? { personId: affectedYellowRedCardPerson } : undefined,
          affectedManager: !isYellowRedCardPlayer ? { personId: affectedYellowRedCardPerson } : undefined,
          reason: yellowRedCardItem.reason,
          notOnPitch: yellowRedCardItem.notOnPitch,
        } satisfies CreateYellowRedCardGameEvent;
      case GameEventType.RedCard:
        const redCardItem = item as EditorRedCardGameEvent;
        const affectedRedCardPerson = ensureNotNullish(redCardItem.affectedPerson);
        const isRedCardPlayer = this.isPersonPlayer(affectedRedCardPerson, lineupInformation);
        return {
          ...baseEvent,
          type: GameEventType.RedCard,
          affectedPlayer: isRedCardPlayer ? { personId: affectedRedCardPerson } : undefined,
          affectedManager: !isRedCardPlayer ? { personId: affectedRedCardPerson } : undefined,
          reason: redCardItem.reason,
          notOnPitch: redCardItem.notOnPitch,
        } satisfies CreateRedCardGameEvent;
      case GameEventType.PenaltyMissed:
        const penaltyMissedItem = item as EditorPenaltyMissedGameEvent;
        return {
          ...baseEvent,
          type: GameEventType.PenaltyMissed,
          takenBy: { personId: penaltyMissedItem.takenBy },
          reason: penaltyMissedItem.reason,
        } satisfies CreatePenaltyMissedGameEvent;
      case GameEventType.VarDecision:
        const varDecisionItem = item as EditorVarDecisionGameEvent;
        return {
          ...baseEvent,
          type: GameEventType.VarDecision,
          affectedPlayer: { personId: varDecisionItem.affectedPerson },
          reason: varDecisionItem.reason,
          decision: varDecisionItem.decision,
        } satisfies CreateVarDecisionGameEvent;
      case GameEventType.InjuryTime:
        const injuryTimeItem = item as EditorInjuryTimeGameEvent;
        return {
          ...baseEvent,
          type: GameEventType.InjuryTime,
          additionalMinutes: injuryTimeItem.additionalMinutes,
        } satisfies CreateInjuryTimeGameEvent;
      case GameEventType.PenaltyShootOut:
        const penaltyShootOutItem = item as EditorPsoGameEvent;
        return {
          ...baseEvent,
          type: GameEventType.PenaltyShootOut,
          minute: 'PSO',
          takenBy: { personId: penaltyShootOutItem.takenBy },
          result: penaltyShootOutItem.result,
        } satisfies CreatePenaltyShootOutGameEvent;
      case GameEventType.ExtraTime:
      case GameEventType.Period:
        throw new Error(`not applicable here`);
      default:
        assertUnreachable(gameEventType);
    }
  }

  private isPersonPlayer(personId: PersonId, lineupInformation: Pick<UpdateGame, 'lineupMain' | 'lineupOpponent' | 'managersMain' | 'managersOpponent'>): boolean {
    return [...lineupInformation.lineupMain ?? [], ...lineupInformation.lineupOpponent ?? []]
      .map(item => item.person.personId)
      .filter(item => isDefined(item))
      .some(item => item === personId);
  }

  private isPersonManager(personId: PersonId, lineupInformation: Pick<UpdateGame, 'lineupMain' | 'lineupOpponent' | 'managersMain' | 'managersOpponent'>): boolean {
    return [...lineupInformation.managersMain ?? [], ...lineupInformation.managersOpponent ?? []]
      .map(item => item.person.personId)
      .filter(item => isDefined(item))
      .some(item => item === personId);
  }

}