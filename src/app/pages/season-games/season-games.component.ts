import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { Season } from '@src/app/model/season';
import { SeasonService } from '@src/app/module/season/service';
import { assertDefined, isDefined, isNotDefined } from '@src/app/util/common';
import { BehaviorSubject, combineLatest, filter, map, Observable, of, Subject, Subscription } from 'rxjs';
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { DetailedGame, GameStatus } from '@src/app/model/game';
import { GameOverviewComponent } from '@src/app/component/game-overview/game-overview.component';
import { SmallClub } from '@src/app/model/club';
import { SeasonSelectComponent } from '@src/app/component/season-select/season-select.component';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { EmptyStateComponent } from '@src/app/component/empty-state/empty-state.component';
import { navigateToGame, navigateToSeasonGames, PATH_PARAM_SEASON_ID } from '@src/app/util/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldWithBallComponent } from '@src/app/icon/field-with-ball/field-with-ball.component';
import { COLOR_DARK_GREY_LIGHTER } from '@src/styles/constants';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-season-games',
  imports: [GameOverviewComponent, CommonModule, SeasonSelectComponent, I18nPipe, EmptyStateComponent, FieldWithBallComponent],
  templateUrl: './season-games.component.html',
  styleUrl: './season-games.component.css'
})
export class SeasonGamesComponent implements OnInit, OnDestroy {

  private static readonly UPCOMING_GAMES_TOP_OFFSET_TRIGGER = 174;

  seasons$: Observable<Season[]> | null = null;
  selectedSeason$ = new BehaviorSubject<SelectOption | null>(null);

  private seasons: Season[] = [];
  private seasonGames: Map<number, DetailedGame[]> = new Map();
  private subscriptions: Subscription[] = [];

  hasSeasonGames = false;
  hasPastGames = false;
  hasUpcomingGames = false;

  mainClub: SmallClub = environment.mainClub;

  colorDarkGreyLighter = COLOR_DARK_GREY_LIGHTER;
  isLoading = false;
  selectedSeason: Season | null = null;
  
  pastSeasonGames: DetailedGame[] = [];
  upcomingSeasonGames: DetailedGame[] = [];

  @ViewChild('upcomingGamesContainer') upcomingGamesRef!: ElementRef;

  private upcomingGamesPositionSubject = new Subject<[number, number] | undefined>();

  constructor(
    private readonly route: ActivatedRoute, 
    private readonly router: Router,
    private readonly seasonService: SeasonService, 
    private readonly seasonGamesService: SeasonGamesService,
    private readonly viewportScroller: ViewportScroller,
  ) {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value instanceof NavigationEnd && this.seasons.length > 0) { // trigger load only if we already have received the seasons
          this.loadSeasonGames(this.getSeasonIdRouteParam());
        }
      });

    const routerScrollingPosition = this.router.events.pipe(
      takeUntilDestroyed(),
      filter((event): event is Scroll => event instanceof Scroll),
      map((event: Scroll) => event.position || undefined),
    );

    const upcomingGamesPosition = this.upcomingGamesPositionSubject.pipe(
        takeUntilDestroyed(),
    );
    
    // note: combine latest only emits after each observable has emitted at least one value
    combineLatest([
      routerScrollingPosition,
      upcomingGamesPosition,
    ]).pipe(takeUntilDestroyed()).subscribe(([routerScrollingPositionValue, upcomingGamesPositionValue]) => {
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
    this.isLoading = true;

    this.subscriptions.push(this.seasonService.getSeasonsObservable().subscribe(seasons => {
      this.seasons = seasons;

      if (seasons.length > 0) {
        this.seasons$ = of(seasons);
        this.loadSeasonGames(this.getSeasonIdRouteParam());
      }
    }));

    this.subscriptions.push(this.seasonGamesService.getSeasonGamesObservable().subscribe(payload => {
      this.seasonGames.set(payload.seasonId, payload.games);

      if (payload.seasonId === this.selectedSeason?.id) {
        this.isLoading = false;
        this.pastSeasonGames = payload.games.filter(game => !this.isUpcomingGame(game));
        this.upcomingSeasonGames = payload.games.filter(game => this.isUpcomingGame(game));

        this.hasPastGames = this.pastSeasonGames.length > 0;
        this.hasUpcomingGames = this.upcomingSeasonGames.length > 0;
        this.hasSeasonGames = this.hasPastGames || this.hasUpcomingGames;

        setTimeout(() => {
          const upcomingGamesPosition = this.upcomingGamesRef?.nativeElement.getBoundingClientRect();

          this.upcomingGamesPositionSubject.next(upcomingGamesPosition !== undefined ? [upcomingGamesPosition.x, upcomingGamesPosition.y] : [0, 0]);
        }, 0);
      }
    }));
  }

  async loadSeasonGames(seasonParam: string): Promise<void> {
    const season = seasonParam === 'current' ? this.seasons[0] : this.seasons.find(item => item.id === Number(seasonParam));
    assertDefined(season, `failed to find season for param ${seasonParam}`);

    this.selectedSeason = season as Season;
    this.selectedSeason$.next({
      id: this.selectedSeason.id,
      name: this.selectedSeason.name,
    });
    
    await this.seasonGamesService.getSeasonGames(this.selectedSeason.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe()); 
  }

  onSeasonSelected(seasonId: OptionId) {
    if (seasonId === this.selectedSeason?.id) {
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
    return selectedSeasonIndex >= 0 && selectedSeasonIndex < (this.seasons.length - 1)
  }

  hasSeasonBefore(): boolean {
    return this.getSelectedSeasonIndex() > 0;
  }

  private getSelectedSeasonIndex(): number {
    const selectedSeasonId = this.selectedSeason?.id;
    if (isNotDefined(selectedSeasonId)) {
      return -1;
    }

    return this.seasons.findIndex(item => item.id === selectedSeasonId);
  }

  private getSeasonIdRouteParam() {
    return this.route.snapshot.paramMap.get(PATH_PARAM_SEASON_ID) as string;
  }

  private isUpcomingGame(game: DetailedGame): boolean {
    return game.status === GameStatus.Scheduled;
  }

}
