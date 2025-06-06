import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit, Signal, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { Season } from '@src/app/model/season';
import { SeasonService } from '@src/app/module/season/service';
import { assertDefined, isDefined, isNotDefined } from '@src/app/util/common';
import { filter, map, Observable, of, Subscription, take, tap } from 'rxjs';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { DetailedGame } from '@src/app/model/game';
import { GameOverviewComponent } from '@src/app/component/game-overview/game-overview.component';
import { SmallClub } from '@src/app/model/club';
import { SeasonSelectComponent } from '@src/app/component/season-select/season-select.component';
import { OptionId } from '@src/app/component/select/option';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { EmptyStateComponent } from '@src/app/component/empty-state/empty-state.component';
import { navigateToGame, navigateToSeasonGames, PATH_PARAM_SEASON_ID } from '@src/app/util/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FieldWithBallComponent } from '@src/app/icon/field-with-ball/field-with-ball.component';
import { COLOR_DARK_GREY_LIGHTER } from '@src/styles/constants';

@Component({
  selector: 'app-season-games',
  imports: [GameOverviewComponent, CommonModule, LoadingComponent, SeasonSelectComponent, I18nPipe, EmptyStateComponent, FieldWithBallComponent],
  templateUrl: './season-games.component.html',
  styleUrl: './season-games.component.css'
})
export class SeasonGamesComponent implements OnInit, OnDestroy {

  seasons$: Observable<Season[]> | null = null;

  private seasons: Season[] = [];
  private seasonGames: Map<number, DetailedGame[]> = new Map();
  private subscriptions: Subscription[] = [];

  mainClub: SmallClub = {
    id: 1,
    name: "SK Sturm Graz",
    shortName: "Sturm Graz",
    iconSmall: "http://localhost:8020/c/1.png",
  }

  colorDarkGreyLighter = COLOR_DARK_GREY_LIGHTER;
  isLoading = false;
  selectedSeason: Season | null = null;
  selectedSeasonGames: DetailedGame[] = [];

  scrollingRef = viewChild<HTMLElement>('scrolling');

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

      const scrollingPosition: Signal<[number, number] | undefined> = toSignal(
        this.router.events.pipe(
          takeUntilDestroyed(),
          filter((event): event is Scroll => event instanceof Scroll),
          map((event: Scroll) => event.position || [0, 0]),
        ),
      );

      effect(() => {
        if (this.scrollingRef() && scrollingPosition()) {
          this.viewportScroller.scrollToPosition(scrollingPosition()!);
        }
      });
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
        this.selectedSeasonGames = payload.games;
      }
    }));
  }

  async loadSeasonGames(seasonParam: string): Promise<void> {
    const season = seasonParam === 'current' ? this.seasons[0] : this.seasons.find(item => item.id === Number(seasonParam));
    assertDefined(season, `failed to find season for param ${seasonParam}`);

    this.selectedSeason = season as Season;
    
    await this.seasonGamesService.getSeasonGames(this.selectedSeason.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe()); 
  }

  onSeasonSelected(seasonId: OptionId) {
    if (seasonId === this.selectedSeason?.id) {
      return;
    }

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

}
