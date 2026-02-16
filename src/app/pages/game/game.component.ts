import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { SmallClub } from '@src/app/model/club';
import { BasicGame, DetailedGame, GameStatus, MatchdayDetails, RefereeRole, ScoreTuple, Tendency, UiGame, UiGamePlayer, UiScoreBoardItem } from '@src/app/model/game';
import { GameResolver } from '@src/app/module/game/resolver';
import { convertToUiGame, getGameResult } from '@src/app/module/game/util';
import { ensureNotNullish, isDefined, isNotDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { navigateToClub, navigateToCompetition, navigateToGameWithoutDetails, navigateToModifyGame, navigateToPerson, navigateToSeasonGames, navigateToVenue, parseUrlSlug, PATH_PARAM_GAME_ID, replaceHash } from '@src/app/util/router';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Subject, switchMap, take, takeUntil } from 'rxjs';
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
import { Chip } from '@src/app/component/chip/chip.component';
import { GameId, SeasonId, VenueId } from '@src/app/util/domain-types';
import { RoundInformationComponent } from "@src/app/component/round-information/round-information.component";
import { MatchdayDetailsService } from '@src/app/module/game/matchday-details-service';
import { ToastService } from '@src/app/module/toast/service';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { ContextMenuSection, ContextMenuComponent, ContextMenuItem } from "@src/app/component/context-menu/context-menu.component";
import { AuthService } from '@src/app/module/auth/service';
import { AccountRole } from '@src/app/model/auth';
import { GameService } from '@src/app/module/game/service';
import { ModalService } from '@src/app/module/modal/service';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { ScoreFormatter } from '@src/app/module/game/score-formatter';
import { GameMinuteFormatter } from '@src/app/module/game/minute-formatter';
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { CheckboxStarComponent } from "@src/app/component/checkbox-star/checkbox-star.component";
import { CheckboxEyeComponent } from "@src/app/component/checkbox-eye/checkbox-eye.component";
import { AccountGameInformationService } from '@src/app/module/account/game-information';
import { Person } from '@src/app/model/person';
import { getDisplayName } from '@src/app/util/domain';
import { SmallCompetition } from '@src/app/model/competition';

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
    RoundInformationComponent,
    ContextMenuComponent,
    UiIconComponent,
    CheckboxStarComponent,
    CheckboxEyeComponent
],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnDestroy {

  private static readonly KEY_GAME_DELETE = "game-delete";
  private static readonly KEY_GAME_EDIT = "game-edit";
  private static readonly KEY_GAME_IMPORT = "game-import";

  private static readonly GAME_IMPORT_THRESHOLD_MILLISECONDS = 7_200_000;  // 2 hours

  game: DetailedGame | null = null;
  uiGame!: UiGame;
  isLoading = true;
  readonly activeTab$ = new BehaviorSubject<string | null>(null);
  readonly lastGamesAgainstClub$ = new Subject<BasicGame[]>;
  readonly performanceTrendAgainstClub$ = new Subject<BasicGame[]>;
  readonly isContextMenuVisible = signal(false);
  readonly gameContextMenuOptions = new BehaviorSubject<ContextMenuSection[]>([]);

  private previousLeg: DetailedGame | null = null;

  readonly colorLightGrey = COLOR_LIGHT_GREY;
  readonly colorGold = COLOR_GOLD;

  readonly attendChecked = signal(false);
  readonly starChecked = signal(false);

  mainClub: SmallClub = environment.mainClub;
  mainWonOnAwayGoals: boolean | null = null;
  lineupTeamChips: Chip[] = [];

  matchdayDetailsLoading = true;
  matchdayDetails?: MatchdayDetails | null;

  shouldHideGeneralDetails = false;
  isMatchdayTableVisible = true;

  private readonly destroy$ = new Subject<void>();
  private readonly lastGamesAvailable = new BehaviorSubject<boolean>(false);
  
  private readonly starGameUpdate$ = new Subject<boolean>();
  private readonly attendGameUpdate$ = new Subject<boolean>(); 

  private readonly countryFlagService = inject(CountryFlagService);
  private readonly viewportScroller = inject(ViewportScroller);

  private readonly accountGameInformationService = inject(AccountGameInformationService);
  private readonly authService = inject(AuthService);
  private readonly clubResolver = inject(ClubResolver);
  private readonly gameService = inject(GameService);
  private readonly gameResolver = inject(GameResolver);
  private readonly matchdayDetailsService = inject(MatchdayDetailsService);
  private readonly gameMinuteFormatter = inject(GameMinuteFormatter);
  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly scoreFormatter = inject(ScoreFormatter);
  private readonly seasonGamesService = inject(SeasonGamesService);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);

  constructor() {
    this.authService.authIdentity$.pipe(takeUntil(this.destroy$)).subscribe(identity => {
      if (identity === null || identity.role !== AccountRole.Manager) {
        this.isContextMenuVisible.set(false);
        this.gameContextMenuOptions.next([]);
        return;
      }
    });

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

    this.starGameUpdate$
      .pipe(
        debounceTime(400),
        switchMap(updatedValue => {
          const gameId = ensureNotNullish(this.game).id;
          if (updatedValue) {
            return this.gameService.star(gameId);
          } else {
            return this.gameService.unstar(gameId);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: (err) => console.error(`failed to update game star status`, err),
      });

    this.attendGameUpdate$
      .pipe(
        debounceTime(400),
        switchMap(updatedValue => {
          const gameId = ensureNotNullish(this.game).id;
          if (updatedValue) {
            return this.gameService.attend(gameId);
          } else {
            return this.gameService.unattend(gameId);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: (err) => console.error(`failed to update game attend status`, err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGameResolved(game: DetailedGame): void {
    this.game = game;
    this.uiGame = convertToUiGame(game, { penalty: () => "(P)", ownGoal: () => "(OG)", score: (tuple) => this.scoreFormatter.format(tuple), minute: (minute) => this.gameMinuteFormatter.format(minute) });

    // context menu
    const topSectionItems: ContextMenuItem[] = [
      { 'id': GameComponent.KEY_GAME_EDIT, 'text': this.translationService.translate('menu.editGame'), iconDescriptor: { 'type': 'standard', 'content': 'pen' } },
    ];

    if (this.game.status === GameStatus.Scheduled && (new Date().getTime() - new Date(this.game.kickoff).getTime() > GameComponent.GAME_IMPORT_THRESHOLD_MILLISECONDS)) {
      topSectionItems.push(
        { 'id': GameComponent.KEY_GAME_IMPORT, 'text': this.translationService.translate('menu.importGame'), iconDescriptor: { 'type': 'standard', 'content': 'import' } },
      )
    }

    this.gameContextMenuOptions.next([
      { items: topSectionItems },
      { items: [
        { 'id': GameComponent.KEY_GAME_DELETE, 'text': this.translationService.translate('menu.deleteGame'), iconDescriptor: { 'type': 'standard', 'content': 'delete' }, isDanger: true },
      ] },
    ])
    this.isContextMenuVisible.set(true);

    this.lineupTeamChips = [
      { selected: true, value: 'main', displayText: this.mainClub.shortName, displayIcon: { type: 'club', content: this.mainClub.iconSmall!, containerClasses: ['width-1-25rem', 'mr-2', 'relative', 'top-1'] } },
      { selected: false, value: 'opponent', displayText: game.opponent.shortName, displayIcon: { type: 'club', content: game.opponent.iconSmall!, containerClasses: ['width-1-25rem', 'mr-2', 'relative', 'top-1'] } },
    ]

    this.isMatchdayTableVisible = this.game.competition.id !== 4 && !this.game.leg;

    // asynchronously fetch previous leg information
    if (isDefined(this.game.previousLeg)) {
      this.resolvePreviousLeg(this.game.previousLeg, this.game.season.id);
    } else {
      // if there is no previous leg to resolve we can finish loading now
      this.isLoading = false;
    }

    this.starChecked.set(this.accountGameInformationService.isStarred(this.game.id));
    this.attendChecked.set(this.accountGameInformationService.isAttended(this.game.id));

    // if it is an upcoming game, fetch the last games to display the record
    if (game.status === GameStatus.Scheduled) {
      this.clubResolver.getById(game.opponent.id, true).pipe(take(1)).subscribe({
        next: (clubResponse) => {
          if (clubResponse.lastGames) {
            const lastGamesWithOpponent = clubResponse.lastGames.map(item => ({ opponent: clubResponse.club, ...item }));
            this.lastGamesAgainstClub$.next(lastGamesWithOpponent);
            this.performanceTrendAgainstClub$.next(lastGamesWithOpponent.slice(0, 5).reverse());

            setTimeout(() => this.lastGamesAvailable.next(true), 0);
          }
        },
        error: (error) => {
          console.warn(error);
        }
      })
    }
  }

  onClubSelected(club: SmallClub): void {
    navigateToClub(this.router, club);
  }

  onCompetitionSelected(competition: SmallCompetition) {
    navigateToCompetition(this.router, competition);
  }

  onGameContextMenuItemSelected(itemId: string) {
    if (this.game) {
      const gameId = this.game.id;
      const gameSeasonId = this.game.season.id;
      if (itemId === GameComponent.KEY_GAME_EDIT) {
        navigateToModifyGame(this.router, this.game.id)
      } else if (itemId === GameComponent.KEY_GAME_DELETE) {
        this.modalService.showDeleteModal()
          .pipe(
            filter(event => event.type === 'confirm'),
            switchMap(() => this.gameService.delete(gameId)),
            takeUntil(this.destroy$)
          ).subscribe({
            next: () => {
              this.toastService.addToast({ text: this.translationService.translate('gameDelete.success'), type: 'success' });

              // reload the games of the season to make sure the new game will be available
              this.seasonGamesService.getSeasonGames(gameSeasonId, true);

              navigateToSeasonGames(this.router, gameSeasonId);
            },
            error: err => {
              console.error(`failed to delete game with ID ${gameId}`, err);

              this.toastService.addToast({ text: `${this.translationService.translate('gameDelete.failure')}`, type: 'error' });
            }
          });
      } else if (itemId === GameComponent.KEY_GAME_IMPORT) {
        this.gameService.import(this.game.id).pipe(take(1)).subscribe(result => {
          if (result.success) {
            this.toastService.addToast({ text: this.translationService.translate('gameImport.success'), type: 'success' });

            // reload the games of the season to make sure the new game will be available
            this.seasonGamesService.getSeasonGames(gameSeasonId, true);
          } else {
            this.toastService.addToast({ text: `${this.translationService.translate('gameImport.failure')}: "${result.error}"`, type: 'error' }, 10_000);
          }
        });
      }
    }
  }

  onRefereeSelected() {
    const referee = this.game!.report.referees.find(item => item.role === RefereeRole.Referee);
    if (isNotDefined(referee)) {
      return;
    }

    this.onPersonSelected(referee.person);
  }

  onGamePlayerSelected(player: UiGamePlayer) {
    this.onPersonSelected({ id: player.personId, firstName: player.firstName, lastName: player.lastName });
  }

  onPersonSelected(person: Person): void {
    navigateToPerson(this.router, person.id, getDisplayName(person.firstName, person.lastName));
  }

  onAttendToggle() {
    const toggledValue = !this.attendChecked();

    this.attendGameUpdate$.next(toggledValue);

    this.attendChecked.set(toggledValue);
  }

  onStarToggle() {
    const toggledValue = !this.starChecked();

    this.starGameUpdate$.next(toggledValue);

    this.starChecked.set(toggledValue);
  }

  onVenueSelected(venueId: VenueId): void {
    navigateToVenue(this.router, venueId);
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
    parts.push(`${isNaN(Number(round)) ? '' : this.translationService.translate('competitionRound.round')}\u00a0${round}`);

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

    const gameScore = getGameResult(this.game!, false);
    const previousLegScore = getGameResult(this.previousLeg);

    if (gameScore === null || previousLegScore === null) {
      return null;
    }

    const aggregateMain = this.game!.isHomeGame ? gameScore[0] + previousLegScore[1] : gameScore[1] + previousLegScore[0];
    const aggregateOpponent = this.game!.isHomeGame ? gameScore[1] + previousLegScore[0] : gameScore[0] + previousLegScore[1];

    let additionalMain = 0;
    let additionalOpponent = 0;

    if (aggregateMain === aggregateOpponent) {
      // see if there was a PSO in this game
      const gameScoreWithPotentialPso = ensureNotNullish(getGameResult(this.game!));
      const potentialPsoDifferential = gameScoreWithPotentialPso[0] - gameScoreWithPotentialPso[1];

      if (isDefined(this.game!.penaltyShootOut) && potentialPsoDifferential !== 0) {
        if (potentialPsoDifferential > 0) {
          additionalMain += .5;
        } else {
          additionalOpponent += .5;
        }
      } else {
        const awayGoalsMain = this.game!.isHomeGame ? previousLegScore[1] : gameScore[0];
        const awayGoalsOpponent = this.game!.isHomeGame ? gameScore[1] : previousLegScore[0];

        // check for away goals win
        if (awayGoalsMain > awayGoalsOpponent) {
          this.mainWonOnAwayGoals = true;
          additionalMain += .5;
        } else if (awayGoalsOpponent > awayGoalsMain) {
          this.mainWonOnAwayGoals = false;
          additionalOpponent += .5;
        }
      }
    }

    return [aggregateMain + additionalMain, aggregateOpponent + additionalOpponent];
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

    const effectiveAggregateScore: [number, number] = this.game!.isHomeGame ? [Math.floor(aggregateScore[0]), Math.floor(aggregateScore[1])] : [Math.floor(aggregateScore[1]), Math.floor(aggregateScore[0])];
    return this.scoreFormatter.format(effectiveAggregateScore);
  }

  private getResult(score: ScoreTuple | null): string {    
    return this.scoreFormatter.format(score);
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

    return [referee.person.firstName, referee.person.lastName].filter(item => isDefined(item)).join(' ');
  }

  getRefereeNationalities(): CountryFlag[] {
    const referee = this.game!.report.referees.find(item => item.role === RefereeRole.Referee);
    if (isNotDefined(referee)) {
      return []
    }

    const nationalities = referee.person.nationalities ?? [];
    return this.countryFlagService.resolveNationalities(nationalities);
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

      const gameId: GameId = parseUrlSlug(ensureNotNullish(this.route.snapshot.paramMap.get(PATH_PARAM_GAME_ID)));
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