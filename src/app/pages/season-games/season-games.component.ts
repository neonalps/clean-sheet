import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { Season } from '@src/app/model/season';
import { SeasonService } from '@src/app/module/season/service';
import { ensureNotNullish, isDefined, isNotDefined } from '@src/app/util/common';
import { BehaviorSubject, combineLatest, filter, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { DetailedGame, GameStatus } from '@src/app/model/game';
import { GameOverviewComponent } from '@src/app/component/game-overview/game-overview.component';
import { SmallClub } from '@src/app/model/club';
import { SeasonSelectComponent } from '@src/app/component/season-select/season-select.component';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { EmptyStateComponent } from '@src/app/component/empty-state/empty-state.component';
import { navigateToGame, navigateToSeasonGames, PATH_PARAM_SEASON_ID } from '@src/app/util/router';
import { FieldWithBallComponent } from '@src/app/icon/field-with-ball/field-with-ball.component';
import { COLOR_DARK_GREY_LIGHTER } from '@src/styles/constants';
import { environment } from '@src/environments/environment';
import { ModalService } from '@src/app/module/modal/service';
import { FilterGameListPayload } from '@src/app/component/modal-game-list-filter/modal-game-list-filter.component';
import { FilterService, GameListFilterItem } from '@src/app/module/filter/service';

export type VisibleSeasonGames = {
  past: DetailedGame[];
  upcoming: DetailedGame[];
  filteredCount: number | undefined;
  totalCount: number;
  appliedFilters: number;
}

@Component({
  selector: 'app-season-games',
  imports: [GameOverviewComponent, CommonModule, SeasonSelectComponent, I18nPipe, EmptyStateComponent, FieldWithBallComponent],
  templateUrl: './season-games.component.html',
  styleUrl: './season-games.component.css'
})
export class SeasonGamesComponent implements OnInit, OnDestroy {

  private static readonly UPCOMING_GAMES_TOP_OFFSET_TRIGGER = 174;

  seasons$: Observable<Season[]> | null = null;
  readonly selectedSeason$ = new BehaviorSubject<SelectOption | null>(null);

  readonly isLoading = signal(true);

  private seasons = signal<Season[]>([]);

  readonly mainClub: SmallClub = environment.mainClub;

  readonly colorDarkGreyLighter = COLOR_DARK_GREY_LIGHTER;
  readonly selectedSeason = signal<Season | null>(null);

  readonly visiblePastSeasonGames = signal<DetailedGame[]>([]);
  readonly visibleUpcomingSeasonGames = signal<DetailedGame[]>([]);

  readonly visibleSeasonGames = signal<VisibleSeasonGames>({
    past: [],
    upcoming: [],
    totalCount: 0,
    filteredCount: 0,
    appliedFilters: 0,
  });

  readonly gameListFilters = signal<GameListFilterItem[]>([]);

  private readonly seasonGames = signal<DetailedGame[]>([]);

  @ViewChild('upcomingGamesContainer') upcomingGamesRef!: ElementRef;

  private readonly upcomingGamesPositionSubject = new Subject<[number, number] | undefined>();

  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly filterService = inject(FilterService);
  private readonly router = inject(Router);
  private readonly seasonService = inject(SeasonService);
  private readonly seasonGamesService = inject(SeasonGamesService);
  private readonly viewportScroller = inject(ViewportScroller);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value instanceof NavigationEnd && this.seasons().length > 0) { // trigger load only if we already have received the seasons
          this.loadSeasonGames(this.getSeasonIdRouteParam());
        }
      });

    const routerScrollingPosition = this.router.events.pipe(
      filter((event): event is Scroll => event instanceof Scroll),
      map((event: Scroll) => event.position || undefined),
      takeUntil(this.destroy$),
    );

    const upcomingGamesPosition = this.upcomingGamesPositionSubject.pipe(
        takeUntil(this.destroy$)
    );
    
    // note: combine latest only emits after each observable has emitted at least one value
    combineLatest([
      routerScrollingPosition,
      upcomingGamesPosition,
    ]).pipe(takeUntil(this.destroy$)).subscribe(([routerScrollingPositionValue, upcomingGamesPositionValue]) => {
      // ignore any undefined upcoming games position values
      if (upcomingGamesPositionValue === undefined) {
        return;
      }

      const scrollY = routerScrollingPositionValue !== undefined ? routerScrollingPositionValue[1] : null;
      const upcomingGamesY = upcomingGamesPositionValue[1];

      const finalScrollY = this.determineScrollY(scrollY, upcomingGamesY, window.innerHeight);
      this.viewportScroller.scrollToPosition([0, finalScrollY]);
    });
  }

  private determineScrollY(scrollY: number | null, upcomingGamesY: number | null, innerHeight: number): number {
    // if we got a position via scroll, we take that one
    // if we didn't get a position via scroll, we use the one we got from the upcoming games position
    // if we didn't get a position via upcoming games, we fall back to 0.
    if (isDefined(scrollY)) {
      return scrollY;
    }

    // only use the effectiveUpcomingY if it larger than the screen height
    if (isDefined(upcomingGamesY) && (upcomingGamesY + SeasonGamesComponent.UPCOMING_GAMES_TOP_OFFSET_TRIGGER) > innerHeight) {
      return Math.floor(upcomingGamesY - (innerHeight - SeasonGamesComponent.UPCOMING_GAMES_TOP_OFFSET_TRIGGER));
    }

    return 0;
  }

  ngOnInit(): void {
    this.seasonService.getSeasonsObservable().pipe(takeUntil(this.destroy$)).subscribe(seasons => {
      this.seasons.set(seasons);

      if (seasons.length > 0) {
        this.seasons$ = of(seasons);
        this.loadSeasonGames(this.getSeasonIdRouteParam());
      }
    });

    this.seasonGamesService.getSeasonGamesObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
      if (payload.seasonId === this.selectedSeason()?.id) {
        this.isLoading.set(true);
        this.onSeasonGamesUpdate(payload.games);
        this.isLoading.set(false);

        setTimeout(() => {
          const upcomingGamesPosition = this.upcomingGamesRef?.nativeElement.getBoundingClientRect();

          this.upcomingGamesPositionSubject.next(upcomingGamesPosition !== undefined ? [upcomingGamesPosition.x, upcomingGamesPosition.y] : [0, 0]);
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadSeasonGames(seasonParam: string): Promise<void> {
    const storedSeasons = this.seasons();
    const season = ensureNotNullish(seasonParam === 'current' ? storedSeasons[0] : storedSeasons.find(item => item.id === Number(seasonParam)));
    
    this.selectedSeason.set(season);
    this.selectedSeason$.next({
      id: season.id,
      name: season.name,
    });
    
    await this.seasonGamesService.getSeasonGames(season.id);
  }

  onSeasonSelected(seasonId: OptionId) {
    if (seasonId === this.selectedSeason()?.id) {
      return;
    }

    // we must emit an undefined value for the upcoming games observable because it otherwise it will assume the previous value is still valid for this one (due to the use of combineLatest)
    this.upcomingGamesPositionSubject.next(undefined);

    navigateToSeasonGames(this.router, Number(seasonId))
  }

  triggerNavigateToGame(game: DetailedGame) {
    navigateToGame(this.router, game);
  }

  hasSeasonAfter(): boolean {
    const selectedSeasonIndex = this.getSelectedSeasonIndex();
    return selectedSeasonIndex >= 0 && selectedSeasonIndex < (this.seasons().length - 1)
  }

  hasSeasonBefore(): boolean {
    return this.getSelectedSeasonIndex() > 0;
  }

  showFilterGameListModal(): void {
    this.modalService.showFilterGameListModal({
      gameListFilterItems: this.gameListFilters(),
    }).pipe(
        filter(event => event.type === 'confirm'),
        map(event => ensureNotNullish(event.value) as FilterGameListPayload),
        takeUntil(this.destroy$),
    ).subscribe(value => {
      this.gameListFilters.set([...value.gameListFilterItems]);
      this.applyFilters();
    });
  }

  resetFilters(): void {
    this.gameListFilters.set([]);
    this.applyFilters();
  }

  private onSeasonGamesUpdate(games: DetailedGame[]) {
    this.seasonGames.set([...games]);

    this.applyFilters();
  }

  private applyFilters() {
    const currentSeasonGames = this.seasonGames();
    const currentGameListFilters = this.gameListFilters();

    const filteredGames = this.filterService.applyGamesFilter(currentSeasonGames, currentGameListFilters);

    const past: DetailedGame[] = [];
    const upcoming: DetailedGame[] = [];

    for (const game of filteredGames) {
      if (this.isUpcomingGame(game)) {
        upcoming.push(game);
      } else {
        past.push(game);
      }
    }

    this.visibleSeasonGames.set({
      past,
      upcoming,
      filteredCount: currentGameListFilters.length > 0 ? filteredGames.length : undefined,
      totalCount: currentSeasonGames.length,
      appliedFilters: currentGameListFilters.length,
    });
  }

  private getSelectedSeasonIndex(): number {
    const selectedSeasonId = this.selectedSeason()?.id;
    if (isNotDefined(selectedSeasonId)) {
      return -1;
    }

    return this.seasons().findIndex(item => item.id === selectedSeasonId);
  }

  private getSeasonIdRouteParam() {
    return this.route.snapshot.paramMap.get(PATH_PARAM_SEASON_ID) as string;
  }

  private isUpcomingGame(game: DetailedGame): boolean {
    return game.status === GameStatus.Scheduled;
  }

}
