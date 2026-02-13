import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStatus, ManagingRole, RefereeRole, TacticalFormation } from '@src/app/model/game';
import { UiIconDescriptor } from '@src/app/model/icon';
import { ClubId, CompetitionId, DateString, GameId, PersonId, VenueId } from '@src/app/util/domain-types';
import { navigateToSeasonGames, PATH_PARAM_GAME_ID } from '@src/app/util/router';
import { BehaviorSubject, filter, map, Observable, of, Subject, take, takeUntil } from 'rxjs';
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
import { ToastService } from '@src/app/module/toast/service';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { LocalStorageStorageProvider } from '@src/app/module/storage/local-storage';

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

type CurrentModifyGameState = {
  startedAt: DateString;
  step: ModifyGameStep;
  isEditMode: boolean;
  base: Partial<BaseGameInformation>;
  lineup?: ModifyGameLineup;
  events?: EditorGameEvent[];
}

@Component({
  selector: 'app-game-modify',
  imports: [CommonModule, StepperComponent, StepperItemComponent, I18nPipe, GameEventEditorComponent, ModifyBaseGameComponent, ModifyGameLineupsComponent],
  templateUrl: './game-modify.component.html',
  styleUrl: './game-modify.component.css'
})
export class ModifyGameComponent implements OnInit, OnDestroy {

  private static readonly CACHE_KEY_MODIFY_GAME_STATE = "currentModifyGameState";

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

  readonly currentStep = signal<ModifyGameStep>('general');

  readonly gameLineup = signal<ModifyGameLineup | null>(null);
  readonly gameLineup$ = toObservable(this.gameLineup).pipe(filter(item => item !== null));

  readonly gameEvents = signal<EditorGameEvent[]>([]);
  readonly gameEvents$ = toObservable(this.gameEvents);

  readonly isEditMode = signal(false);
  
  private readonly baseGameInformation = signal<Partial<BaseGameInformation>>({});
  readonly baseGameInformation$ = toObservable(this.baseGameInformation);

  readonly onlyBaseInformationEditable = signal(false);

  readonly modifyGameSteps$ = new BehaviorSubject<StepConfig[]>([]);

  private readonly currentCacheValue = signal<CurrentModifyGameState | null>(null);

  private readonly localStorageProvider = inject(LocalStorageStorageProvider);
  private readonly modifyGameService = inject(ModifyGameService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seasonGamesService = inject(SeasonGamesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  // Bound handler to allow removeEventListener to work correctly
  private beforeUnloadHandler = this.onBeforeUnload.bind(this);

  ngOnInit(): void {
    window.addEventListener('beforeunload', this.beforeUnloadHandler);

    const gameIdPathParam = this.route.snapshot.paramMap.get(PATH_PARAM_GAME_ID);
    this.initModifyGame(isDefined(gameIdPathParam) ? Number(gameIdPathParam) : null);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);

    this.destroy$.next();
    this.destroy$.complete();
  }

  private initModifyGame(gameId: GameId | null) {
    this.resolveCurrentGameModifyState(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        console.log('state', state)
        this.isEditMode.set(state.isEditMode);

        const canOnlyEditBaseGameInformation = isDefined(state.base.id) && state.base.status === GameStatus.Finished;
        this.onlyBaseInformationEditable.set(canOnlyEditBaseGameInformation);

        this.modifyGameSteps$.next(canOnlyEditBaseGameInformation ? ModifyGameComponent.UPDATE_GAME_STEPS : ModifyGameComponent.CREATE_GAME_STEPS);

        this.currentStep.set(state.step);
        this.baseGameInformation.set(state.base);

        // in edit mode we don't set state and events
        if (state.isEditMode) {
          this.gameLineup.set(state.lineup ?? null);
          this.gameEvents.set(state.events ?? []);
        }

        this.storeCacheValue(state);
      });
  }

  private updateCacheValue(update: Partial<Pick<CurrentModifyGameState, 'step' | 'base' | 'events' | 'lineup'>>) {
    const current = this.currentCacheValue();
    if (current === null) {
      return;
    }

    const updated: CurrentModifyGameState = {
      ...current,
      ...update,
    };
    this.storeCacheValue(updated);
  }

  private storeCacheValue(state: CurrentModifyGameState) {
    this.currentCacheValue.set(state);
    this.localStorageProvider.set(ModifyGameComponent.CACHE_KEY_MODIFY_GAME_STATE, state);
  }

  private resolveCurrentGameModifyState(gameId: GameId | null): Observable<CurrentModifyGameState> {
    // check the cache for an existing entry
    const existingCacheValue = this.localStorageProvider.get<CurrentModifyGameState>(ModifyGameComponent.CACHE_KEY_MODIFY_GAME_STATE);

    if (existingCacheValue && (gameId === null || existingCacheValue.base?.id === gameId)) {
      // there is a cache value and it's the same game ID or a new game, so we can use the state from the cache
      return of(existingCacheValue).pipe(map(value => {
        return {
          ...value,
          base: {
            ...value.base,
            kickoff: value.base.kickoff ? new Date(value.base.kickoff) : undefined,
          },
        };
      }));
    } else {
      const modifyGameInputObservable = gameId !== null ? this.modifyGameService.editGame(gameId) : this.modifyGameService.newGame();

      return modifyGameInputObservable
        .pipe(
          takeUntil(this.destroy$),
          map(input => {
            return {
              startedAt: new Date().toISOString(),
              step: 'general',
              isEditMode: gameId !== null,
              base: {
                ...input,
                kickoff: input.kickoff ? new Date(input.kickoff) : undefined,
              }
            }
          }),
        );
    }

  }

  onGameLineupUpdate(lineup: ModifyGameLineup) {
    this.gameLineup.set(lineup);
    this.modifyGameService.updateGameInput({
      lineup: lineup,
    });

    this.updateCacheValue({
      lineup: lineup,
    });
  }

  onSaveClicked() {
    this.modifyGameService.submitGame().pipe(take(1)).subscribe({
      next: result => {
        console.log('successfully submitted game', result);

        this.clearCache();

        this.toastService.addToast({ text: this.translationService.translate('gameCreate.success'), type: 'success' });
        
        // reload the games of the season to make sure the new game will be available
        this.seasonGamesService.getSeasonGames(result.season.id, true);

        navigateToSeasonGames(this.router, result.season.id);
      },
      error: err => {
        console.error(`failed to submit game`, err);

        this.toastService.addToast({ text: `${this.translationService.translate('gameCreate.failure')}`, type: 'error' });
      }
    })
  }

   onBackClicked() {
    const step = this.currentStep();
    switch (step) {
      case 'general':
        throw new Error(`Cannot go back`);
      case 'lineups':
        this.modifyGameSteps$.next([
          { stepId: 'general', active: true, completed: true, disabled: false, hidden: false },
          { stepId: 'lineups', active: false, completed: false, disabled: false, hidden: false },
          { stepId: 'events', active: false, completed: false, disabled: true, hidden: false },
        ]);
        this.currentStep.set('general');
        this.updateCacheValue({
          step: 'general',
        });
        break;
      case 'events':
        this.modifyGameSteps$.next([
          { stepId: 'general', active: false, completed: true, disabled: false, hidden: false },
          { stepId: 'lineups', active: true, completed: true, disabled: false, hidden: false },
          { stepId: 'events', active: false, completed: false, disabled: true, hidden: false },
        ]);
        this.currentStep.set('lineups');
        this.updateCacheValue({
          step: 'lineups',
        });
        break;
      default:
        assertUnreachable(step);
    }
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
        this.updateCacheValue({
          step: 'lineups',
        });
        break;
      case 'lineups':
        this.modifyGameSteps$.next([
          { stepId: 'general', active: false, completed: true, disabled: false, hidden: false },
          { stepId: 'lineups', active: false, completed: true, disabled: false, hidden: false },
          { stepId: 'events', active: true, completed: false, disabled: true, hidden: false },
        ]);
        this.currentStep.set('events');
        this.updateCacheValue({
          step: 'events',
        });
        break;
      case 'events':
        console.log('save now');
        break;
      default:
        assertUnreachable(step);
    }
  }

  isNextAvailable(): boolean {
    return this.currentStep() !== 'events';
  }

  onBaseGameInformationUpdate(baseGame: BaseGameInformation) {
    this.baseGameInformation.set(baseGame);
    this.modifyGameService.updateGameInput({
      ...baseGame,
      kickoff: baseGame.kickoff?.toISOString(),
    });
    
    this.updateCacheValue({
      base: baseGame,
    })
  }

  onGameEventsUpdate(gameEvents: EditorGameEvent[]) {
    this.modifyGameService.updateGameInput({
      events: gameEvents,
    });

    this.updateCacheValue({
      events: gameEvents,
    });
  }

  private isEditingInProcess(): boolean {
    return this.currentCacheValue() !== null;
  }

  private clearCache() {
    this.currentCacheValue.set(null);
    this.localStorageProvider.remove(ModifyGameComponent.CACHE_KEY_MODIFY_GAME_STATE);
  }

  private onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.isEditingInProcess()) {
      // Displaying a confirmation dialog (browser may override the text)
      event.preventDefault();
      event.returnValue = '';
    }
  }

}
