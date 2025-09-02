import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { SelectComponent } from "@src/app/component/select/select.component";
import { ExternalSearchEntity } from '@src/app/model/external-search';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { combineLatest, debounceTime, map, merge, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { DatetimePickerComponent } from "@src/app/component/datetime-picker/datetime-picker.component";
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ButtonComponent } from "@src/app/component/button/button.component";
import { CheckboxSliderComponent } from "@src/app/component/checkbox-slider/checkbox-slider.component";
import { ClubResolver } from '@src/app/module/club/resolver';
import { BasicClub } from '@src/app/model/club';
import { ClubId, CompetitionId, VenueId } from '@src/app/util/domain-types';
import { environment } from '@src/environments/environment';
import { toObservable } from '@angular/core/rxjs-interop';
import { CreateGame, GameStatus } from '@src/app/model/game';
import { ToastService } from '@src/app/module/toast/service';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { navigateToSeasonGames } from '@src/app/util/router';
import { Router } from '@angular/router';
import { GameService } from '@src/app/module/game/service';
import { COLOR_LIGHT } from '@src/styles/constants';
import { EmptySearchOptionComponent } from "@src/app/component/empty-search-option/empty-search-option.component";

type UiGame = {
  kickoff: Date;
  competitionId: CompetitionId;
  competitionRound: string;
  opponentId: ClubId;
  venueId: VenueId;
  isHomeGame: boolean;
  gameStatus: GameStatus;
}

@Component({
  selector: 'app-game-create',
  imports: [CommonModule, I18nPipe, SelectComponent, DatetimePickerComponent, ButtonComponent, CheckboxSliderComponent, EmptySearchOptionComponent],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css'
})
export class GameCreateComponent implements OnInit, OnDestroy {

  isSearchingForClub = false;
  isSearchingForCompetition = false;
  isSearchingForCompetitionRound = false;
  isSearchingForVenue = false;
  isHomeGame = signal(true);
  
  colorLight = COLOR_LIGHT;
  canSubmit = signal(false);
  isSubmitting = signal(false);

  readonly pushSelectedVenue$ = new Subject<SelectOption>();
  readonly pushGameState$ = new Subject<SelectOption>();

  private readonly clubSearch$ = new Subject<string>();
  private readonly competitionSearch$ = new Subject<string>();
  private readonly competitionRoundSearch$ = new Subject<string>();
  private readonly venueSearch$ = new Subject<string>();

  private readonly clubResolver = inject(ClubResolver);
  private readonly externalSearchService = inject(ExternalSearchService);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly mainClub: BasicClub = environment.mainClub;

  private readonly selectedCompetitionId$ = new Subject<number>();
  private readonly selectedCompetitionRound$ = new Subject<string>();
  private readonly selectedGameState$ = new Subject<string>();
  private readonly selectedIsHomeGame$: Observable<boolean>;
  private readonly selectedKickoff$ = new Subject<Date | undefined>();
  private readonly selectedOpponentId$ = new Subject<number>();
  private readonly selectedVenueId$ = new Subject<number>();

  private readonly destroy$ = new Subject<void>();

  private selectedOpponent?: BasicClub;
  private gameToCreate: CreateGame | null = null;

  constructor() {
    this.selectedIsHomeGame$ = toObservable(this.isHomeGame);
  }

  ngOnInit(): void {

    combineLatest([
      this.selectedKickoff$,
      this.selectedCompetitionId$,
      this.selectedCompetitionRound$,
      this.selectedOpponentId$,
      this.selectedIsHomeGame$,
      merge(this.pushGameState$.pipe(map(item => item.id.toString() as GameStatus)), this.selectedGameState$.pipe(map(item => item as GameStatus))),
      merge(this.pushSelectedVenue$.pipe(map(item => Number(item.id))), this.selectedVenueId$),
    ]).pipe(takeUntil(this.destroy$)).subscribe(gameInformation => {
      if (gameInformation[0] === undefined) {
        this.canSubmit.set(false);
        this.gameToCreate = null;
        return;
      }

      const uiGame: UiGame = {
        kickoff: gameInformation[0],
        competitionId: gameInformation[1],
        competitionRound: gameInformation[2],
        opponentId: gameInformation[3],
        isHomeGame: gameInformation[4],
        gameStatus: gameInformation[5],
        venueId: gameInformation[6],
      };

      this.gameToCreate = {
        kickoff: uiGame.kickoff.toISOString(),
        status: uiGame.gameStatus,
        competition: {
          competitionId: uiGame.competitionId,
        },
        competitionRound: uiGame.competitionRound,
        opponent: {
          clubId: uiGame.opponentId,
        },
        venue: {
          venueId: uiGame.venueId,
        },
        isHomeGame: uiGame.isHomeGame,
        lineupMain: [],
        lineupOpponent: [],
        events: [],
        managersMain: [],
        managersOpponent: [],
        referees: [],
      }

      this.canSubmit.set(true);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onKickoffSelected(kickoff: Date | undefined) {
    this.selectedKickoff$.next(kickoff);

    if (kickoff === undefined) {
      return;
    }

    if (kickoff.getTime() > new Date().getTime()) {
      // push scheduled game state
      this.getGameStatusOptions().pipe(
        take(1),
        map(items => items.filter(item => item.id === 'Scheduled')),
        map(items => items[0])
      ).subscribe(item => this.pushGameState$.next(item));
    } else {
      // push finished game state
      this.getGameStatusOptions().pipe(
        take(1),
        map(items => items.filter(item => item.id === 'Finished')),
        map(items => items[0])
      ).subscribe(item => this.pushGameState$.next(item));
    }
  }

  onClubSearchChanged(value: string) {
    this.clubSearch$.next(value);
  }

  onOpponentSelected(id: OptionId) {
    this.selectedOpponentId$.next(Number(id));

    this.clubResolver.getById(Number(id), false).pipe(take(1)).subscribe({
      next: (clubResponse) => {
        this.selectedOpponent = clubResponse.club;
        
        // auto-fill the venue based on the information we received
        this.pushSelectedVenue(this.selectedOpponent);
      },
      error: (error) => {
        console.error(error);
        this.selectedOpponent = undefined;
      },
    });
  }

  getClubOptions(): Observable<SelectOption[]> {
    return merge(this.getDefaultClubOptions(), this.searchForClub());
  }

  private searchForClub(): Observable<SelectOption[]> {
      return this.clubSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultClubOptions();  
          }
  
          this.isSearchingForClub = true;
          return this.externalSearchService.search(value, [ExternalSearchEntity.Club]);
        }),
        map(response => {
          this.isSearchingForClub = false;
          if ('items' in response) {
            return response.items.map(item => convertExternalSearchItemToSelectOption(item));
          }
  
          return response;
        }),
      );
    }
  
    private getDefaultClubOptions(): Observable<SelectOption[]> {
      return of([]);
    }

    getVenueOptions(): Observable<SelectOption[]> {
      return merge(this.getDefaultVenueOptions(), this.searchForVenue());
    }

    onVenueSearchChanged(value: string) {
      this.venueSearch$.next(value);
    }

    onVenueSelected(id: OptionId) {
      this.selectedVenueId$.next(Number(id));
    }

    private searchForVenue(): Observable<SelectOption[]> {
      return this.venueSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultVenueOptions();  
          }
  
          this.isSearchingForVenue = true;
          return this.externalSearchService.search(value, [ExternalSearchEntity.Venue]);
        }),
        map(response => {
          this.isSearchingForVenue = false;
          if ('items' in response) {
            return response.items.map(item => convertExternalSearchItemToSelectOption(item));
          }
  
          return response;
        }),
      );
    }

    private getDefaultVenueOptions(): Observable<SelectOption[]> {
      return of([]);
    }

    getCompetitionOptions(): Observable<SelectOption[]> {
      return merge(this.getDefaultCompetitionOptions(), this.searchForCompetition());
    }

    onCompetitionSearchChanged(value: string) {
      this.competitionSearch$.next(value);
    }

    onCompetitionSelected(id: OptionId) {
      this.selectedCompetitionId$.next(Number(id));
    }

    private searchForCompetition(): Observable<SelectOption[]> {
      return this.competitionSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultCompetitionOptions();  
          }
  
          this.isSearchingForCompetition = true;
          return this.externalSearchService.search(value, [ExternalSearchEntity.Competition]);
        }),
        map(response => {
          this.isSearchingForCompetition = false;
          if ('items' in response) {
            return response.items.map(item => convertExternalSearchItemToSelectOption(item));
          }
  
          return response;
        }),
      );
    }

    private getDefaultCompetitionOptions(): Observable<SelectOption[]> {
      return of([]);
    }

    getGameStatusOptions(): Observable<SelectOption[]> {
      return merge(this.getDefaultGameStatusOptions());
    }

    onGameStatusSelected(id: OptionId) {
      this.selectedGameState$.next(id.toString());
    }

    private getDefaultGameStatusOptions(): Observable<SelectOption[]> {
      return of([
        { id: 'Scheduled', name: this.translationService.translate(`gameStatus.scheduled`) },
        { id: 'Finished', name: this.translationService.translate(`gameStatus.finished`) },
        { id: 'Ongoing', name: this.translationService.translate(`gameStatus.ongoing`) },
        { id: 'Abandoned', name: this.translationService.translate(`gameStatus.abandoned`) },
        { id: 'Postponed', name: this.translationService.translate(`gameStatus.postponed`) },
      ]);
    }

    onCompetitionRoundSearchChanged(value: string) {
      this.competitionRoundSearch$.next(value);
    }

    onCompetetitionRoundSelected(id: OptionId) {
      this.selectedCompetitionRound$.next(id.toString());
    }

    private searchForCompetitionRound(): Observable<SelectOption[]> {
      return this.competitionRoundSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          const optionSource = this.getDefaultCompetitionRoundOptions();

          if (value.trim().length === 0) {
            return optionSource;
          }

          return optionSource.pipe(
            map(options => {
              return options.filter(option => option.name.toLocaleLowerCase().includes(value.toLocaleLowerCase().trim()))
            })
          );
        }),
      );
    }

    getCompetitionRoundOptions(): Observable<SelectOption[]> {
      return merge(this.getDefaultCompetitionRoundOptions(), this.searchForCompetitionRound());
    }

    private getDefaultCompetitionRoundOptions(): Observable<SelectOption[]> {
      const options: SelectOption[] = [];

      for (let i = 1; i <= 32; i++) {
        options.push({
          id: i.toString(),
          name: i.toString(),
        });
      }

      ['final', 'semifinal', 'quarterfinal', 'roundOf16', 'roundOf32'].forEach(koRound => {
        options.push({
          id: koRound,
          name: this.translationService.translate(`competitionRound.${koRound}`),
        });
      })

      return of(options);
    }

    onIsHomeValueChange(newValue: boolean) {
      this.isHomeGame.set(newValue);

      if (!this.selectedOpponent) {
        return;
      }

      this.pushSelectedVenue(this.selectedOpponent);
    }

    private pushSelectedVenue(opponent: BasicClub) {
      if (this.isHomeGame()) {
        this.pushSelectedVenue$.next({
          id: this.mainClub.homeVenue!.id.toString(),
          name: this.mainClub.homeVenue!.name,
        });
      } else if (opponent.homeVenue) {
        this.pushSelectedVenue$.next({
          id: opponent.homeVenue.id.toString(),
          name: opponent.homeVenue.shortName,
        });
      }
    }

    createGame() {
      this.canSubmit.set(false);
      this.isSubmitting.set(true);

      this.gameService.create(this.gameToCreate!).pipe(take(1)).subscribe({
        next: createdGame => {
          this.toastService.addToast({ type: 'success', text: this.translationService.translate('game.wasCreated') });
          navigateToSeasonGames(this.router, createdGame.season.id);
        },
        error: error => {
          console.error('failed to create game', error);
          this.toastService.addToast({ type: 'error', text: this.translationService.translate('game.failedToCreate') });
        }
      });
    }

}
