import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { SmallClub } from '@src/app/model/club';
import { BasicGame, DetailedGame, GameStatus, MatchdayDetails, RefereeRole, ScoreTuple, Tendency, UiGame, UiScoreBoardItem } from '@src/app/model/game';
import { GameResolver } from '@src/app/module/game/resolver';
import { convertToUiGame, getGameResult, transformGameMinute } from '@src/app/module/game/util';
import { isDefined, isNotDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { navigateToClub, navigateToGameWithoutDetails, navigateToPerson, PATH_PARAM_GAME_ID, replaceHash } from '@src/app/util/router';
import { BehaviorSubject, combineLatest, filter, map, Subject, take, takeUntil } from 'rxjs';
import { LargeClubComponent } from "@src/app/component/large-club/large-club.component";
import { TabItemComponent } from "@src/app/component/tab-item/tab-item.component";
import { TabGroupComponent } from '@src/app/component/tab-group/tab-group.component';
import { GameEventsComponent } from "@src/app/component/game-events/game-events.component";
import { API_FIELD_TRANSLATION_PREFIX, TranslationService } from '@src/app/module/i18n/translation.service';
import { environment } from '@src/environments/environment';
import { StadiumIconComponent } from "@src/app/icon/stadium/stadium.component";
import { COLOR_GOLD, COLOR_LIGHT_GREY } from '@src/styles/constants';
import { RefereeIconComponent } from '@src/app/icon/referee/referee.component';
import { AttendanceIconComponent } from "@src/app/icon/attendance/attendance.component";
import { FormatNumberPipe } from '@src/app/pipe/format-number.pipe';
import { getNumberOfDaysBetween, isToday } from '@src/app/util/date';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameLineupComponent } from "@src/app/component/game-lineup/game-lineup.component";
import { TrophyIconComponent } from "@src/app/icon/trophy/trophy.component";
import { ClubResolver } from '@src/app/module/club/resolver';
import { GamePerformanceTrendComponent } from "@src/app/component/game-performance-trend/game-performance-trend.component";
import { GameOverviewComponent } from "@src/app/component/game-overview/game-overview.component";
import { ChipGroupComponent } from "@src/app/component/chip-group/chip-group.component";
import { Chip } from '@src/app/component/chip/chip.component';
import { GameId, SeasonId } from '@src/app/util/domain-types';
import { RoundInformationComponent } from "@src/app/component/round-information/round-information.component";
import { MatchdayDetailsService } from '@src/app/module/game/matchday-details-service';
import { ToastService } from '@src/app/module/toast/service';

export type GameRouteState = {
  game: DetailedGame;
}

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    I18nPipe,
    LargeClubComponent,
    TabGroupComponent,
    TabItemComponent,
    GameEventsComponent,
    RefereeIconComponent,
    StadiumIconComponent,
    AttendanceIconComponent,
    FormatNumberPipe,
    GameLineupComponent,
    TrophyIconComponent,
    GamePerformanceTrendComponent,
    GameOverviewComponent,
    ChipGroupComponent,
    RoundInformationComponent
],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnDestroy {

  game: DetailedGame | null = null;
  uiGame!: UiGame;
  isLoading = true;
  activeTab$ = new BehaviorSubject<string | null>(null);
  readonly lastGamesAgainstClub$ = new Subject<BasicGame[]>;
  readonly performanceTrendAgainstClub$ = new Subject<BasicGame[]>;

  private previousLeg: DetailedGame | null = null;

  readonly colorLightGrey = COLOR_LIGHT_GREY;
  readonly colorGold = COLOR_GOLD;

  readonly competitionChips: Chip[] = [
    { displayText: 'Alle Bewerbe', value: 'all', selected: true, },
    { displayText: 'Bundesliga', value: '2', selected: false, },
    { displayText: 'Cup', value: '4', selected: false },
  ];

  mainClub: SmallClub = environment.mainClub;
  mainWonOnAwayGoals: boolean | null = null;
  lineupTeamChips: Chip[] = [];

  matchdayDetailsLoading = true;
  matchdayDetails?: MatchdayDetails | null;

  shouldHideGeneralDetails = false;
  isMatchdayTableVisible = true;

  private readonly destroy$ = new Subject<void>();
  private readonly lastGamesAvailable = new BehaviorSubject<boolean>(false);
  private readonly viewportScroller = inject(ViewportScroller);

  constructor(
    private readonly clubResolver: ClubResolver,
    private readonly gameResolver: GameResolver,
    private readonly matchdayDetailsService: MatchdayDetailsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translationService: TranslationService,
    private readonly toastService: ToastService,
  ) {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value instanceof NavigationEnd) {
          this.lastGamesAvailable.next(false);
          this.loadGameDetails();
        }
      });

    const routerScrollPosition$ = this.router.events.pipe(
      takeUntil(this.destroy$),
      filter((event): event is Scroll => event instanceof Scroll),
      map((event: Scroll) => event.position || undefined),
      filter((value: [number, number] | undefined) => value !== undefined),
    );

    const lastGamesAvailable$ = this.lastGamesAvailable.pipe(takeUntil(this.destroy$));

    combineLatest([
      routerScrollPosition$,
      lastGamesAvailable$,
    ]).pipe(takeUntil(this.destroy$)).subscribe(([routerScrollPositionValue, lastGamesAvailableValue]) => {
      if (lastGamesAvailableValue === false) {
        return;
      }

      setTimeout(() => {
        this.viewportScroller.scrollToPosition(routerScrollPositionValue);
      }, 0);
    });    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGameResolved(game: DetailedGame): void {
    this.game = game;
    this.uiGame = convertToUiGame(game, { penalty: () => "(P)", ownGoal: () => "(OG)", score: (tuple) => [tuple[0], tuple[1]].join(":"), minute: (minute) => transformGameMinute(minute, '.') });

    this.lineupTeamChips = [
      { selected: true, value: 'main', displayText: this.mainClub.shortName, displayIcon: { type: 'club', content: this.mainClub.iconSmall!, containerClasses: ['width-1-25rem', 'mr-2', 'relative', 'top-1'] } },
      { selected: false, value: 'opponent', displayText: game.opponent.shortName, displayIcon: { type: 'club', content: game.opponent.iconSmall!, containerClasses: ['width-1-25rem', 'mr-2', 'relative', 'top-1'] } },
    ]

    this.isMatchdayTableVisible = this.game.competition.id !== 4 && !this.game.leg;

    // asynchronously fetch previous leg information
    if (isDefined(this.game.previousLeg)) {
      this.resolvePreviousLeg(this.game.previousLeg, this.game.season.id);
    } else {
      // if there is no previous leg to resolvem we can finish loading now
      this.isLoading = false;
    }

    // if it is an upcoming game, fetch the last games to display the record
    if (game.status === GameStatus.Scheduled) {
      this.clubResolver.getById(game.opponent.id, true).pipe(take(1)).subscribe({
        next: (club) => {
          if (club.lastGames) {
            this.lastGamesAgainstClub$.next(club.lastGames);
            this.performanceTrendAgainstClub$.next(club.lastGames.slice(0, 5).reverse());

            setTimeout(() => this.lastGamesAvailable.next(true), 0);
          }
        },
        error: (error) => {
          console.warn(error);
        }
      })
    }
  }

  onClubSelected(clubId: number): void {
    navigateToClub(this.router, clubId);
  }

  onPersonSelected(personId: number): void {
    navigateToPerson(this.router, personId);
  }

  onTabSelected(tabId: string) {
    replaceHash(tabId);

    if (tabId === 'matchday') {
      this.matchdayDetailsLoading = true;
      this.shouldHideGeneralDetails = true;
      this.matchdayDetailsService.getForGame(this.game!.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: details => {
          this.matchdayDetails = {
            ...details,
            competitionRound: this.game!.round,
          };
          this.matchdayDetailsLoading = false;
        },
        error: error => {
          console.error(error);
          this.matchdayDetails = null;
          this.toastService.addToast({ type: 'error', text: this.translationService.translate(`matchdayDetails.failedToLoad`) });
          this.matchdayDetailsLoading = false;
        }
      })
    } else {
      this.shouldHideGeneralDetails = false;
    }
  }

  getHomeTeam(): SmallClub {
    return this.game!.isHomeGame ? this.mainClub : this.game!.opponent;
  }

  getAwayTeam(): SmallClub {
    return this.game!.isHomeGame ? this.game!.opponent : this.mainClub;
  }

  getGameStatus(): string {
    return this.translationService.translate(`gameStatus.${this.game!.status.toLocaleLowerCase()}`);
  }

  showGameStatus(): boolean {
    return this.game!.status !== GameStatus.Finished || isToday(new Date(this.game!.kickoff));
  }

  getHomeScoringBoard(): UiScoreBoardItem[] {
    return this.game!.isHomeGame ? this.uiGame!.scoreBoard.main : this.uiGame!.scoreBoard.opponent;
  }

  getAwayScoringBoard(): UiScoreBoardItem[] {
    return this.game!.isHomeGame ? this.uiGame!.scoreBoard.opponent : this.uiGame!.scoreBoard.main;
  }

  getMainLineup() {
    return this.uiGame.lineup.main;
  }

  getOpponentLineup() {
    return this.uiGame.lineup.opponent;
  }

  getCompetitionName(): string {
    const parts: string[] = [];

    // competition name
    if (isDefined(this.game!.competition.parent)) {
      parts.push(this.game!.competition.parent.shortName);
    }

    const competitionShortName = processTranslationPlaceholders(this.game!.competition.shortName, this.translationService);
    parts.push(competitionShortName);

    // competition stage
    let stage = this.game!.stage;
    if (isDefined(stage)) {
      parts.push(processTranslationPlaceholders(stage, this.translationService));
    }

    // competition round
    const needsTranslation = isNaN(Number(this.game!.round));
    const competitionRound = needsTranslation ? [`{`, API_FIELD_TRANSLATION_PREFIX, 'competitionRound.', this.game!.round, `}`].join('') : this.game!.round;
    const round = processTranslationPlaceholders(competitionRound, this.translationService);
    parts.push(`${isNaN(Number(round)) ? '' : this.translationService.translate('competitionRound.round')} ${round}`);

    return parts.join(' · ');
  }

  getLegInformation(): string | null {
    const leg = this.game!.leg;
    if (isNotDefined(leg)) {
      return null;
    }

    const parts: string[] = [];

    parts.push(this.translationService.translate(`game.leg.${this.game!.leg}`));

    if (isDefined(this.previousLeg) && this.previousLeg.status === GameStatus.Finished) {
      parts.push(this.translationService.translate(`game.aggregate`));
    }

    return parts.join(' · ');
  }

  getVictoryGameText(): string | null {
    if (isNotDefined(this.game?.victoryGameText)) {
      return null;
    }

    return this.translationService.translate(this.game.victoryGameText, { main: this.mainClub.shortName, titleCount: { ordinalValue: this.game.titleCount as number } });
  }

  getAwayGoalsText(): string | null {
    if (this.mainWonOnAwayGoals === null) {
      return null;
    }

    return this.translationService.translate('game.decidedByAwayGoals', { club: this.mainWonOnAwayGoals === true ? this.mainClub.name : this.game!.opponent.name })
  }

  showGameDetails(): boolean {
    return this.game?.status === GameStatus.Finished;
  }

  hasExtendedPlay(): boolean {
    return isDefined(this.game!.afterExtraTime) || isDefined(this.game!.penaltyShootOut);
  }

  getGameScoreBeforePso(): string {
    return this.getResult(getGameResult(this.game!, false));
  }

  getGameScoreAfterPso(): string {
    return this.getResult(getGameResult(this.game!, true));
  }

  getExtendedPlayText(): string {
    if (isDefined(this.game!.penaltyShootOut)) {
      return this.translationService.translate(`gameResult.pso`, { 'score': this.getGameScoreAfterPso() });
    }

    return this.translationService.translate('gameResult.aet');
  }

  getAggregateScoreTuple(): ScoreTuple | null {
    if (isNotDefined(this.previousLeg)) {
      return null;
    }

    const gameScore = getGameResult(this.game!);
    const previousLegScore = getGameResult(this.previousLeg);

    if (gameScore === null || previousLegScore === null) {
      return null;
    }

    const aggregateMain = this.game!.isHomeGame ? gameScore[0] + previousLegScore[1] : gameScore[1] + previousLegScore[0];
    const aggregateOpponent = this.game!.isHomeGame ? gameScore[1] + previousLegScore[0] : gameScore[0] + previousLegScore[1];

    if (aggregateMain === aggregateOpponent) {
      // we assume the tie was won on away goals
      const awayGoalsMain = this.game!.isHomeGame ? previousLegScore[1] : gameScore[0];
      const awayGoalsOpponent = this.game!.isHomeGame ? gameScore[1] : previousLegScore[0];

      if (awayGoalsMain > awayGoalsOpponent) {
        this.mainWonOnAwayGoals = true;
      } else if (awayGoalsOpponent > awayGoalsMain) {
        this.mainWonOnAwayGoals = false;
      }
    }

    return [aggregateMain + (this.mainWonOnAwayGoals === true ? .5 : 0), aggregateOpponent + (this.mainWonOnAwayGoals === false ? .5 : 0)];
  }

  getAggregateScore(): string | null {
    // only show the aggregate score box if the first leg is already finished
    if (this.previousLeg?.status !== GameStatus.Finished) {
      return null;
    }

    const aggregateScore = this.getAggregateScoreTuple();
    if (aggregateScore === null) {
      return null;
    }

    return this.game!.isHomeGame ? [Math.floor(aggregateScore[0]), Math.floor(aggregateScore[1])].join(":") : [Math.floor(aggregateScore[1]), Math.floor(aggregateScore[0])].join(":");
  }

  private getResult(score: ScoreTuple | null): string {    
    return score !== null ? score.join(":") : "-";
  }

  getGameResultTendencyClass(): string {
    return this.getResultTendencyClass(this.game!.resultTendency);
  }

  getDynamicContainerClasses(): string[] {
    const classes = [];

    if (this.game!.titleWinningGame === true) {
      classes.push('border-1 border-gold border-solid');
    }

    return classes;
  }

  getUpcomingText(): string {
    const daysUntil = getNumberOfDaysBetween(new Date(this.game!.kickoff), new Date());
    
    if (daysUntil === 0) {
      return this.translationService.translate(`date.today`);
    } else if (daysUntil === 1) {
      return this.translationService.translate(`date.tomorrow`);
    } else {
      return this.translationService.translate(`date.inDays`, { days: daysUntil });
    }
  }

  getAggregateResultTendencyClass(): string | null {
    const aggregateScore = this.getAggregateScoreTuple();
    if (aggregateScore === null) {
      return null;
    }

    const aggregateTendency: Tendency = aggregateScore[0] > aggregateScore[1] ? 'w' : aggregateScore[1] > aggregateScore[0] ? 'l' : 'd';
    return this.getResultTendencyClass(aggregateTendency);
  }

  shouldShowLastGames(): boolean {
    return this.game?.status === GameStatus.Scheduled;
  }

  private getResultTendencyClass(tendency: Tendency): string {
    return `result-tendency-${tendency}`;
  }

  getRefereeName(): string | null {
    const referee = this.game!.report.referees.find(item => item.role === RefereeRole.Referee);
    if (isNotDefined(referee)) {
      return null;
    }

    return [referee?.person.firstName, referee?.person.lastName].filter(item => isDefined(item)).join(' ');
  }

  triggerNavigateToGame(game: BasicGame) {
    navigateToGameWithoutDetails(this.router, game.id, game.season.id);
  }

  private loadGameDetails() {
    // TODO implement view port scroller to restore router scroll position

    const currentNav = this.router.getCurrentNavigation();

    const selectedTab = currentNav?.extractedUrl?.fragment ?? 'events';
    this.activeTab$.next(selectedTab);

    const game = currentNav?.extras?.state?.['game'];
    if (isDefined(game)) {
      console.log('resolved via game details')
      this.onGameResolved(game);
    } else {
      // no game passed in state (can happen if the user copied the link), we must resolve the game manually
      const seasonId: string | undefined = currentNav?.extras?.state?.['seasonId'] ?? undefined;

      const gameId = this.route.snapshot.paramMap.get(PATH_PARAM_GAME_ID);
      if (isDefined(gameId)) {
        this.resolveGame(Number(gameId), seasonId !== undefined ? Number(seasonId) : undefined);
      } else {
        // TODO show error content
        this.isLoading = false;
        console.error(`Could not resolve game ID`);
      }
    }
  }

  private resolveGame(gameId: GameId, seasonId?: SeasonId) {
    this.gameResolver.getById(gameId, seasonId).pipe(take(1)).subscribe({
      next: game => {
        this.onGameResolved(game);
      },
      error: err => {
        // TODO show error
        this.isLoading = false;
        console.error(`Could not resolve game`, err);
      }
    });
  }

  private resolvePreviousLeg(previousLeg: number, seasonId: number) {
    this.gameResolver.getById(previousLeg, seasonId).pipe(take(1)).subscribe({
          next: game => {
            this.previousLeg = game;
            this.isLoading = false;
          },
          error: err => {
            console.error(`Could not resolve previous leg`, err);
            this.isLoading = false;
          }
        });
  }

}