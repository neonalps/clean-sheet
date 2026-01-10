import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { SelectOption } from '@src/app/component/select/option';
import { SelectComponent } from "@src/app/component/select/select.component";
import { ExternalSearchEntity } from '@src/app/model/external-search';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, merge, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { DatetimePickerComponent } from "@src/app/component/datetime-picker/datetime-picker.component";
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { CheckboxSliderComponent } from "@src/app/component/checkbox-slider/checkbox-slider.component";
import { ClubResolver } from '@src/app/module/club/resolver';
import { BasicClub } from '@src/app/model/club';
import { ClubId, CompetitionId, GameId, PersonId, VenueId } from '@src/app/util/domain-types';
import { environment } from '@src/environments/environment';
import { GameStatus } from '@src/app/model/game';
import { CommonModule } from '@angular/common';
import { COLOR_LIGHT } from '@src/styles/constants';
import { EmptySearchOptionComponent } from "@src/app/component/empty-search-option/empty-search-option.component";
import { getHtmlInputElementFromEvent, isDefined } from '@src/app/util/common';
import { UiIconDescriptor } from '@src/app/model/icon';
import { BasicVenue } from '@src/app/model/venue';

export type BaseGameInformation = {
  id?: GameId;
  kickoff: Date;
  competitionId: CompetitionId;
  competitionName?: string;
  competitionIcon?: UiIconDescriptor;
  competitionRound?: string;
  opponentId: ClubId;
  opponentName?: string;
  opponentIcon?: UiIconDescriptor;
  venueId: VenueId;
  venueName?: string;
  venueIcon?: UiIconDescriptor;
  isHomeGame: boolean;
  isSoldOut: boolean;
  status: GameStatus;
  attendance?: number;
  refereeId?: PersonId;
  refereeName?: string;
  refereeIcon?: UiIconDescriptor;
}

@Component({
  selector: 'app-modify-base-game',
  imports: [CommonModule, I18nPipe, SelectComponent, DatetimePickerComponent, CheckboxSliderComponent, EmptySearchOptionComponent],
  templateUrl: './modify-base-game.component.html',
  styleUrl: './modify-base-game.component.css'
})
export class ModifyBaseGameComponent implements OnInit, OnDestroy {

  readonly input = input<Observable<Partial<BaseGameInformation>>>();
  readonly onUpdate = output<BaseGameInformation>();

  isSearchingForClub = signal(false);
  isSearchingForCompetition = signal(false);
  isSearchingForCompetitionRound = signal(false);
  isSearchingForVenue = signal(false);
  isSearchingForReferee = signal(false);
  isHomeGame = signal(false);
  isSoldOut = signal(false);
  
  colorLight = COLOR_LIGHT;

  readonly gameId = signal<GameId | undefined>(undefined);

  readonly pushKickoff$ = new Subject<Date | undefined>();
  readonly pushSelectedOpponent$ = new Subject<SelectOption>();
  readonly pushSelectedCompetition$ = new Subject<SelectOption>();
  readonly pushSelectedCompetitionRound$ = new Subject<SelectOption>();
  readonly pushSelectedVenue$ = new Subject<SelectOption>();
  readonly pushSelectedReferee$ = new Subject<SelectOption>();
  readonly pushGameState$ = new Subject<SelectOption>();
  readonly pushAttendance$ = new Subject<number>();

  private readonly clubSearch$ = new Subject<string>();
  private readonly competitionSearch$ = new Subject<string>();
  private readonly competitionRoundSearch$ = new Subject<string>();
  private readonly venueSearch$ = new Subject<string>();
  private readonly refereeSearch$ = new Subject<string>();

  private readonly clubResolver = inject(ClubResolver);
  private readonly externalSearchService = inject(ExternalSearchService);
  private readonly translationService = inject(TranslationService);

  private readonly mainClub: BasicClub = environment.mainClub;

  private readonly selectedCompetitionId$ = new Subject<CompetitionId>();
  private readonly selectedCompetitionName$ = new Subject<string>();
  private readonly selectedCompetitionRound$ = new Subject<string>();
  private readonly selectedGameState$ = new Subject<string>();
  private readonly selectedIsHomeGame$ = new BehaviorSubject<boolean>(false);
  private readonly selectedIsSoldOut$ = new BehaviorSubject<boolean>(false);
  private readonly selectedKickoff$ = new Subject<Date | undefined>();
  private readonly selectedOpponentId$ = new Subject<ClubId>();
  private readonly selectedOpponentName$ = new Subject<string>();
  private readonly selectedOpponentIcon$ = new BehaviorSubject<UiIconDescriptor | null>(null);
  private readonly selectedVenueId$ = new Subject<VenueId>();
  private readonly selectedVenueName$ = new Subject<string>();
  private readonly selectedRefereeId$ = new BehaviorSubject<PersonId | null>(null);
  private readonly selectedRefereeName$ = new BehaviorSubject<string | null>(null);
  private readonly selectedAttendance$ = new BehaviorSubject<number | null>(null);

  private readonly destroy$ = new Subject<void>();

  private selectedOpponent?: BasicClub;

  ngOnInit(): void {
  
      combineLatest([
        this.selectedKickoff$,
        this.selectedCompetitionId$,
        this.selectedCompetitionRound$,
        this.selectedOpponentId$,
        this.selectedIsHomeGame$,
        merge(this.pushGameState$.pipe(map(item => item.id.toString() as GameStatus)), this.selectedGameState$.pipe(map(item => item as GameStatus))),
        merge(this.pushSelectedVenue$.pipe(map(item => Number(item.id))), this.selectedVenueId$),
        this.selectedIsSoldOut$,
        this.selectedAttendance$,
        this.selectedRefereeId$,
        this.selectedOpponentName$,
        this.selectedCompetitionName$,
        this.selectedRefereeName$,
        this.selectedOpponentIcon$,
      ]).pipe(
        debounceTime(50),
        takeUntil(this.destroy$),
      ).subscribe(gameInformation => {
        if (gameInformation[0] === undefined) {
          return;
        }
  
        this.onUpdate.emit({
          id: this.gameId(),
          kickoff: gameInformation[0],
          competitionId: gameInformation[1],
          competitionRound: gameInformation[2],
          opponentId: gameInformation[3],
          isHomeGame: gameInformation[4],
          status: gameInformation[5],
          venueId: gameInformation[6],
          isSoldOut: gameInformation[7],
          attendance: gameInformation[8] ?? undefined,
          refereeId: gameInformation[9] ?? undefined,
          opponentName: gameInformation[10],
          competitionName: gameInformation[11],
          refereeName: gameInformation[12] ?? undefined,
          opponentIcon: gameInformation[13] ?? undefined,
        });
  
      });

      this.input()?.pipe(
        filter(baseGame => isDefined(baseGame.kickoff)),
        take(1),
      ).subscribe(baseGame => {
        this.gameId.set(baseGame.id);

        // game status
        this.getGameStatusOptions().pipe(
          take(1),
          map(items => items.filter(item => item.id === baseGame.status)),
          map(items => items[0])
        ).subscribe(item => {
          this.pushGameState$.next(item);
        });

        // kickoff
        this.pushKickoff$.next(baseGame.kickoff);
        this.selectedKickoff$.next(baseGame.kickoff);

        // opponent
        if (baseGame.opponentId && baseGame.opponentName) {
          this.pushSelectedOpponent$.next({ id: baseGame.opponentId, name: baseGame.opponentName, icon: baseGame.opponentIcon });
          this.selectedOpponentId$.next(baseGame.opponentId);
        }

        // competition
        if (baseGame.competitionId && baseGame.competitionName) {
          this.pushSelectedCompetition$.next({ id: baseGame.competitionId, name: baseGame.competitionName, icon: baseGame.competitionIcon });
          this.selectedCompetitionId$.next(baseGame.competitionId);
        }

        if (baseGame.competitionRound) {
          this.pushSelectedCompetitionRound$.next({ id: baseGame.competitionRound, name: baseGame.competitionRound });
          this.selectedCompetitionRound$.next(baseGame.competitionRound);
        }

        // venue
        if (baseGame.venueId && baseGame.venueName) {
          this.pushSelectedVenue$.next({ id: baseGame.venueId, name: baseGame.venueName });
          // it seems like we don't need to set the selected venue ID as it is part of the combined latest above already
        }

        if (baseGame.attendance) {
          this.pushAttendance$.next(baseGame.attendance);
          this.selectedAttendance$.next(baseGame.attendance);
        }

        const isHomeGameValue = baseGame.isHomeGame ?? false;
        this.isHomeGame.set(isHomeGameValue);
        this.selectedIsHomeGame$.next(isHomeGameValue);

        const isSoldOutValue = baseGame.isSoldOut ?? false;
        this.isSoldOut.set(isSoldOutValue);
        this.selectedIsSoldOut$.next(isSoldOutValue);

        // referee
        if (baseGame.refereeId && baseGame.refereeName) {
          this.pushSelectedReferee$.next({ id: baseGame.refereeId, name: baseGame.refereeName, icon: baseGame.refereeIcon });
          this.selectedRefereeId$.next(baseGame.refereeId);
        }
      });
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
  
    onOpponentSelected(option: SelectOption) {
      const clubId: ClubId = Number(option.id);
      this.selectedOpponentId$.next(clubId);
      this.selectedOpponentName$.next(option.name);
      this.selectedOpponentIcon$.next(option.icon ?? null);
  
      this.clubResolver.getById(clubId, false).pipe(take(1)).subscribe({
        next: (clubResponse) => {
          this.selectedOpponent = clubResponse.club;
          
          // auto-fill the venue based on the information we received
          this.pushSelectedVenue(this.selectedOpponent.homeVenue);
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
  
          this.isSearchingForClub.set(true);
          return this.externalSearchService.search(value, [ExternalSearchEntity.Club]);
        }),
        map(response => {
          this.isSearchingForClub.set(false);
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

    onVenueSelected(option: SelectOption) {
      this.selectedVenueId$.next(Number(option.id));
      this.selectedVenueName$.next(option.name);
    }

    private searchForVenue(): Observable<SelectOption[]> {
      return this.venueSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultVenueOptions();  
          }
  
          this.isSearchingForVenue.set(true);
          return this.externalSearchService.search(value, [ExternalSearchEntity.Venue]);
        }),
        map(response => {
          this.isSearchingForVenue.set(false);
          if ('items' in response) {
            return response.items.map(item => convertExternalSearchItemToSelectOption(item));
          }
  
          return response;
        }),
      );
    }

    private getDefaultRefereeOptions(): Observable<SelectOption[]> {
      return of([]);
    }

    getRefereeOptions(): Observable<SelectOption[]> {
      return merge(this.getDefaultVenueOptions(), this.searchForReferee());
    }

    onRefereeSearchChanged(value: string) {
      this.refereeSearch$.next(value);
    }

    onRefereeSelected(option: SelectOption) {
      this.selectedRefereeId$.next(Number(option.id));
      this.selectedRefereeName$.next(option.name);
    }

    private searchForReferee(): Observable<SelectOption[]> {
      return this.refereeSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultRefereeOptions();  
          }
  
          this.isSearchingForReferee.set(true);
          return this.externalSearchService.search(value, [ExternalSearchEntity.Person]);
        }),
        map(response => {
          this.isSearchingForReferee.set(false);
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

    onCompetitionSelected(option: SelectOption) {
      this.selectedCompetitionId$.next(Number(option.id));
      this.selectedCompetitionName$.next(option.name);
    }

    private searchForCompetition(): Observable<SelectOption[]> {
      return this.competitionSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultCompetitionOptions();  
          }
  
          this.isSearchingForCompetition.set(true);
          return this.externalSearchService.search(value, [ExternalSearchEntity.Competition]);
        }),
        map(response => {
          this.isSearchingForCompetition.set(false);
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

    onGameStatusSelected(option: SelectOption) {
      this.selectedGameState$.next(option.id.toString());
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

    onCompetetitionRoundSelected(option: SelectOption) {
      this.selectedCompetitionRound$.next(option.id.toString());
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
      this.selectedIsHomeGame$.next(newValue);

      if (!this.selectedOpponent) {
        return;
      }

      this.pushSelectedVenue(this.selectedOpponent.homeVenue);
    }

    onIsSoldOutValueChange(newValue: boolean) {
      this.isSoldOut.set(newValue);
      this.selectedIsSoldOut$.next(newValue);
    }

    onAttendanceChanged(event: Event) {
      const newAttendanceValue = getHtmlInputElementFromEvent(event).value;
      this.selectedAttendance$.next(Number(newAttendanceValue));
    }

    private pushSelectedVenue(opponentHomeVenue?: BasicVenue) {
      if (this.isHomeGame()) {
        this.pushSelectedVenue$.next({
          id: this.mainClub.homeVenue!.id.toString(),
          name: this.mainClub.homeVenue!.name,
        });
      } else if (opponentHomeVenue) {
        this.pushSelectedVenue$.next({
          id: opponentHomeVenue.id.toString(),
          name: opponentHomeVenue.shortName,
        });
      }
    }

}
