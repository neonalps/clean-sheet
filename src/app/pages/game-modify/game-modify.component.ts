import { Component, computed, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmallClub } from '@src/app/model/club';
import { SmallCompetition } from '@src/app/model/competition';
import { DetailedGame, GameManager, GamePlayer, GameStatus, ManagingRole, RefereeRole, TacticalFormation } from '@src/app/model/game';
import { UiIconDescriptor } from '@src/app/model/icon';
import { GameVenue } from '@src/app/model/venue';
import { GameResolver } from '@src/app/module/game/resolver';
import { ClubId, CompetitionId, DateString, GameId, PersonId, VenueId } from '@src/app/util/domain-types';
import { PATH_PARAM_GAME_ID } from '@src/app/util/router';
import { BehaviorSubject, filter, Subject, take, takeUntil } from 'rxjs';
import { StepConfig, StepperComponent } from "@src/app/component/stepper/stepper.component";
import { StepperItemComponent } from "@src/app/component/stepper-item/stepper-item.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameEventEditorComponent } from "@src/app/component/game-event-editor/game-event-editor.component";
import { ModifyGameService } from '@src/app/module/game/modify-service';
import { CommonModule } from '@angular/common';
import { BaseGameInformation, ModifyBaseGameComponent } from "@src/app/component/modify-base-game/modify-base-game.component";
import { toObservable } from '@angular/core/rxjs-interop';
import { assertUnreachable, isDefined } from '@src/app/util/common';
import { ModifyGameLineup, ModifyGameLineupsComponent } from "@src/app/component/modify-game-lineups/modify-game-lineups.component";
import { EditorGameEvent } from '@src/app/module/game-event-editor/types';

export type UserProviderInput = {
  id: string;
  displayText: string;
}

export type ClubUiEntityModel = {
  id: ClubId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type ClubInputModel = {
  entity?: ClubUiEntityModel;
  userProvided?: UserProviderInput;
}

export type CompetitionUiEntityModel = {
  id: CompetitionId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type CompetitionInputModel = {
  entity?: CompetitionUiEntityModel;
  userProvided?: UserProviderInput;
}

export type PersonUiEntityModel = {
  id: PersonId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type PersonInputModel = {
  entity?: PersonUiEntityModel;
  userProvided?: UserProviderInput;
}

export type GamePlayerInputModel = {
  person: PersonInputModel;
  shirt: number;
  isCaptain?: boolean;
  positionGrid?: string;
}

export type GameManagerInputModel = {
  person: PersonInputModel;
  role: ManagingRole;
}

export type RefereeInputModel = {
  person: PersonInputModel;
  role: RefereeRole;
}

export type VenueUiEntityModel = {
  id: VenueId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type VenueInputModel = {
  entity?: VenueUiEntityModel;
  userProvided?: UserProviderInput;
}

export type ModifyGameModel = {
  id?: GameId;
  kickoff?: DateString;
  status?: GameStatus;
  opponent?: ClubInputModel;
  competition?: CompetitionInputModel;
  competitionRound?: string;
  competitionStage?: string;
  leg?: number;
  previousLeg?: GameId;
  isHomeGame?: boolean;
  isNeutralGround?: boolean;
  isSoldOut?: boolean;
  attendance?: number;
  venue?: VenueInputModel;
  referees?: RefereeInputModel[];
  gamePlayersMain?: GamePlayerInputModel[];
  gamePlayersOpponent?: GamePlayerInputModel[];
  gameManagersMain?: GameManagerInputModel[];
  gameManagersOpponent?: GameManagerInputModel[];
  tacticalFormationMain?: TacticalFormation;
  tacticalFormationOpponent?: TacticalFormation;
}

type ModifyGameStep = 'general' | 'lineups' | 'events';

@Component({
  selector: 'app-game-modify',
  imports: [CommonModule, StepperComponent, StepperItemComponent, I18nPipe, GameEventEditorComponent, ModifyBaseGameComponent, ModifyGameLineupsComponent],
  templateUrl: './game-modify.component.html',
  styleUrl: './game-modify.component.css'
})
export class ModifyGameComponent implements OnInit, OnDestroy {

  private static readonly CREATE_GAME_STEPS: Array<StepConfig> = [
    { stepId: 'general', active: true, completed: false, disabled: false, hidden: false },
    { stepId: 'lineups', active: false, completed: false, disabled: true, hidden: false },
    { stepId: 'events', active: false, completed: false, disabled: true, hidden: false },
  ];

  private static readonly UPDATE_GAME_STEPS: Array<StepConfig> = [
    { stepId: 'general', active: true, completed: false, disabled: false, hidden: false },
    { stepId: 'lineups', active: false, completed: false, disabled: true, hidden: true },
    { stepId: 'events', active: false, completed: false, disabled: true, hidden: true },
  ];

  readonly model = signal<ModifyGameModel>({});
  readonly currentStep = signal<ModifyGameStep>('general');
  readonly gameLineup = signal<ModifyGameLineup | null>(null);

  readonly gameLineup$ = toObservable(this.gameLineup).pipe(filter(item => item !== null));

  readonly isEditMode = signal(false);
  
  private readonly baseGameInformation = signal<Partial<BaseGameInformation>>({});
  readonly baseGameInformation$ = toObservable(this.baseGameInformation);

  readonly onlyBaseInformationEditable = signal(false);

  readonly modifyGameSteps$ = new BehaviorSubject<StepConfig[]>([]);
  
  readonly firstStageComplete: Signal<boolean> = computed(() => {
    const current = this.model();
    return current.competition?.entity !== undefined;
  });

  private readonly gameResolver = inject(GameResolver);
  private readonly modifyGameService = inject(ModifyGameService);
  private readonly route = inject(ActivatedRoute);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const gameIdPathParam = this.route.snapshot.paramMap.get(PATH_PARAM_GAME_ID);

    this.isEditMode.set(isDefined(gameIdPathParam));

    const gameId = gameIdPathParam ? Number(gameIdPathParam) : null;

    const modifyGameInputObservable = this.isEditMode() ? this.modifyGameService.editGame(Number(gameIdPathParam)) : this.modifyGameService.newGame();

    modifyGameInputObservable.pipe(takeUntil(this.destroy$)).subscribe(input => {
      console.log('starting with input', input);

      const canOnlyEditBaseGameInformation = isDefined(input.id) && input.status === GameStatus.Finished;
      this.onlyBaseInformationEditable.set(canOnlyEditBaseGameInformation);

      this.modifyGameSteps$.next(canOnlyEditBaseGameInformation ? ModifyGameComponent.UPDATE_GAME_STEPS : ModifyGameComponent.CREATE_GAME_STEPS);

      this.baseGameInformation.set({
        id: input.id,
        status: input.status,
        kickoff: input.kickoff ? new Date(input.kickoff) : undefined,
        competitionId: input.competitionId,
        competitionName: input.competitionName,
        competitionIcon: input.competitionIcon,
        competitionRound: input.competitionRound,
        opponentId: input.opponentId,
        opponentName: input.opponentName,
        opponentIcon: input.opponentIcon,
        venueId: input.venueId,
        venueName: input.venueName,
        isHomeGame: input.isHomeGame,
        isSoldOut: input.isSoldOut,
        attendance: input.attendance,
        refereeId: input.refereeId,
        refereeName: input.refereeName,
        refereeIcon: input.refereeIcon,
      })
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGameLineupUpdate(lineup: ModifyGameLineup) {
    this.gameLineup.set(lineup);
    this.modifyGameService.updateGameInput({
      lineup: lineup,
    });
  }

  onSaveClicked() {
    this.modifyGameService.submitGame().pipe(take(1)).subscribe({
      next: result => {
        console.log('successfully submitted game', result);
      },
      error: err => {
        console.error(`failed to submit game`, err);
      }
    })
  }

  onNextClicked() {
    const step = this.currentStep();
    switch (step) {
      case 'general':
        this.modifyGameSteps$.next([
          { stepId: 'general', active: false, completed: true, disabled: false, hidden: false },
          { stepId: 'lineups', active: true, completed: false, disabled: false, hidden: false },
          { stepId: 'events', active: false, completed: false, disabled: true, hidden: false },
        ]);
        this.currentStep.set('lineups');
        break;
      case 'lineups':
        this.modifyGameSteps$.next([
          { stepId: 'general', active: false, completed: true, disabled: false, hidden: false },
          { stepId: 'lineups', active: false, completed: true, disabled: false, hidden: false },
          { stepId: 'events', active: true, completed: false, disabled: true, hidden: false },
        ]);
        this.currentStep.set('events');
        break;
      case 'events':
        console.log('save now');
        break;
      default:
        assertUnreachable(step);
    }
  }

  onBaseGameInformationUpdate(baseGame: BaseGameInformation) {
    this.baseGameInformation.set(baseGame);
    this.modifyGameService.updateGameInput({
      ...baseGame,
      kickoff: baseGame.kickoff?.toISOString(),
    });
  }

  onGameEventsUpdate(gameEvents: EditorGameEvent[]) {
    this.modifyGameService.updateGameInput({
      events: gameEvents,
    })
  }

  private initializeModel(game: DetailedGame | null) {
    console.log(game?.report.main);

    this.model.set({
      id: game?.id,
      kickoff: game?.kickoff,
      status: game?.status,
      opponent: this.mapOpponent(game?.opponent),
      competition: this.mapCompetition(game?.competition),
      competitionRound: game?.round,
      competitionStage: game?.stage,
      leg: game?.leg,
      previousLeg: game?.previousLeg,
      isHomeGame: game?.isHomeGame,
      isNeutralGround: game?.isNeutralGround,
      isSoldOut: game?.isSoldOut,
      attendance: game?.attendance,
      venue: this.mapVenue(game?.venue),
      gamePlayersMain: this.mapGamePlayers(game?.report.main.lineup),
      gamePlayersOpponent: this.mapGamePlayers(game?.report.opponent.lineup),
      gameManagersMain: this.mapGameManagers(game?.report.main.managers),
      gameManagersOpponent: this.mapGameManagers(game?.report.opponent.managers),
      tacticalFormationMain: game?.report.main.tacticalFormation,
      tacticalFormationOpponent: game?.report.opponent.tacticalFormation,
      referees: game?.report.referees.map(referee => ({ person: { entity: { id: referee.id, displayText: [referee.person.firstName, referee.person.lastName].join(' ') } }, role: referee.role }))
    });

    console.log('model', this.model());
  }

  private mapOpponent(opponent?: SmallClub): ClubInputModel {
    if (!opponent) {
      return {};
    }

    const clubEntity: ClubUiEntityModel = {
      id: opponent.id,
      displayText: opponent.name,
    };

    if (opponent.iconSmall) {
      clubEntity.icon = {
        type: 'club',
        content: opponent.iconSmall,
      }
    }

    return {
      entity: clubEntity,
    }
  }

  private mapCompetition(competition?: SmallCompetition): CompetitionInputModel {
    if (!competition) {
      return {};
    }

    const competitionEntity: CompetitionUiEntityModel = {
      id: competition.id,
      displayText: competition.name,
    };

    if (competition.iconSmall) {
      competitionEntity.icon = {
        type: 'competition',
        content: competition.iconSmall,
      }
    }

    return {
      entity: competitionEntity,
    }
  }

  private mapVenue(venue?: GameVenue): VenueInputModel {
    if (!venue) {
      return {};
    }

    const venueEntity: VenueUiEntityModel = {
      id: venue.id,
      displayText: venue.branding,
    };

    return {
      entity: venueEntity,
    }
  }

  private mapGamePlayers(gamePlayers?: GamePlayer[]): GamePlayerInputModel[] {
    if (!gamePlayers) {
      return [];
    }

    return gamePlayers.map(item => {
      const personEntity: PersonUiEntityModel = {
        id: item.player.id,
        displayText: [item.player.firstName, item.player.lastName].join(' '),
      };

      if (item.player.avatar) {
        personEntity.icon = {
          type: 'person',
          content: item.player.avatar,
        }
      }

      const mappedItem: GamePlayerInputModel = {
        person: {
          entity: personEntity,
        },
        shirt: item.shirt,
      };

      if (item.positionGrid) {
        mappedItem.positionGrid = item.positionGrid;
      }
      
      if (item.captain === true) {
        mappedItem.isCaptain = item.captain;
      }

      return mappedItem;
    });
  }

  private mapGameManagers(gameManagers?: GameManager[]): GameManagerInputModel[] {
    if (!gameManagers) {
      return [];
    }

    return gameManagers.map(item => {
      const personEntity: PersonUiEntityModel = {
        id: item.person.id,
        displayText: [item.person.firstName, item.person.lastName].join(' '),
      };

      if (item.person.avatar) {
        personEntity.icon = {
          type: 'person',
          content: item.person.avatar,
        }
      }

      const mappedItem: GameManagerInputModel = {
        person: {
          entity: personEntity,
        },
        role: item.role,
      };

      return mappedItem;
    });
  }

}
