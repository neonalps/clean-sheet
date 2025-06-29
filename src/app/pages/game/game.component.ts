import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, effect, OnDestroy, OnInit, Signal, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { LoadingComponent } from '@src/app/component/loading/loading.component';
import { SmallClub } from '@src/app/model/club';
import { DetailedGame, GameStatus, RefereeRole, ScoreTuple, Tendency, UiGame, UiScoreBoardItem } from '@src/app/model/game';
import { GameResolver } from '@src/app/module/game/resolver';
import { convertToUiGame, getGameResult, transformGameMinute } from '@src/app/module/game/util';
import { isDefined, isNotDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { navigateToClub, navigateToPerson, PATH_PARAM_GAME_ID, replaceHash } from '@src/app/util/router';
import { BehaviorSubject, filter, map, Subject, Subscription, take, tap } from 'rxjs';
import { LargeClubComponent } from "@src/app/component/large-club/large-club.component";
import { TabItemComponent } from "@src/app/component/tab-item/tab-item.component";
import { TabGroupComponent } from '@src/app/component/tab-group/tab-group.component';
import { GameEventsComponent } from "@src/app/component/game-events/game-events.component";
import { TranslationService } from '@src/app/module/i18n/translation.service';
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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

export type GameRouteState = {
  game: DetailedGame;
}

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    I18nPipe,
    LoadingComponent,
    LargeClubComponent,
    TabGroupComponent,
    TabItemComponent,
    GameEventsComponent,
    RefereeIconComponent,
    StadiumIconComponent,
    AttendanceIconComponent,
    FormatNumberPipe,
    GameLineupComponent,
    TrophyIconComponent
],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy {

  game: DetailedGame | null = null;
  uiGame!: UiGame;
  isLoading = true;
  activeTab$ = new BehaviorSubject<string | null>(null);

  scrollingRef = viewChild<HTMLElement>('scrolling');

  private previousLeg: DetailedGame | null = null;

  readonly colorLightGrey = COLOR_LIGHT_GREY;
  readonly colorGold = COLOR_GOLD;

  mainClub: SmallClub = environment.mainClub;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly gameResolver: GameResolver,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translationService: TranslationService,
    private readonly viewportScroller: ViewportScroller,
  ) {
    const currentNav = this.router.getCurrentNavigation();

    const selectedTab = currentNav?.extractedUrl?.fragment ?? 'events';
    this.activeTab$.next(selectedTab);

    const game = currentNav?.extras?.state?.['game'];
    if (isDefined(game)) {
      this.onGameResolved(game);
    } else {
      // no game passed in state (can happen if the user copied the link), we must resolve the game manually
      const gameId = this.route.snapshot.paramMap.get(PATH_PARAM_GAME_ID);
      if (isDefined(gameId)) {
        this.resolveGame(Number(gameId));
      } else {
        // TODO show error content
        this.isLoading = false;
        console.error(`Could not resolve game ID`);
      }
    }

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
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  onGameResolved(game: DetailedGame): void {
    this.game = game;
    this.uiGame = convertToUiGame(game, { penalty: () => "(P)", ownGoal: () => "(OG)", score: (tuple) => [tuple[0], tuple[1]].join(":"), minute: (minute) => transformGameMinute(minute, '.') });

    // asynchronously fetch previous leg information
    if (isDefined(this.game.previousLeg)) {
      this.resolvePreviousLeg(this.game.previousLeg, this.game.season.id);
    } else {
      // if there is no previous leg to resolvem we can finish loading now
      this.isLoading = false;
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
    const round = processTranslationPlaceholders(this.game!.round, this.translationService);
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

    if (isDefined(this.previousLeg)) {
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

    return [aggregateMain, aggregateOpponent];
  }

  getAggregateScore(): string | null {
    const aggregateScore = this.getAggregateScoreTuple();
    if (aggregateScore === null) {
      return null;
    }

    return this.game!.isHomeGame ? [aggregateScore[0], aggregateScore[1]].join(":") : [aggregateScore[1], aggregateScore[0]].join(":");
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
    
    if (daysUntil === 1) {
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

  private resolveGame(gameId: number) {
    this.gameResolver.getById(gameId).pipe(take(1)).subscribe({
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
