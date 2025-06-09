import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '@src/app/component/loading/loading.component';
import { SmallClub } from '@src/app/model/club';
import { DetailedGame, GameStatus, RefereeRole, UiGame, UiScoreBoardItem } from '@src/app/model/game';
import { GameResolver } from '@src/app/module/game/resolver';
import { convertToUiGame, getGameResult, transformGoalMinute } from '@src/app/module/game/util';
import { isDefined, isNotDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { PATH_PARAM_GAME_ID } from '@src/app/util/router';
import { Subscription, take } from 'rxjs';
import { LargeClubComponent } from "@src/app/component/large-club/large-club.component";
import { TabItemComponent } from "@src/app/component/tab-item/tab-item.component";
import { TabGroupComponent } from '@src/app/component/tab-group/tab-group.component';
import { GameEventsComponent } from "@src/app/component/game-events/game-events.component";
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { environment } from '@src/environments/environment';
import { StadiumIconComponent } from "@src/app/icon/stadium/stadium.component";
import { COLOR_LIGHT_GREY } from '@src/styles/constants';
import { RefereeIconComponent } from '@src/app/icon/referee/referee.component';
import { AttendanceIconComponent } from "@src/app/icon/attendance/attendance.component";
import { FormatNumberPipe } from '@src/app/pipe/format-number.pipe';
import { isToday } from '@src/app/util/date';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameLineupComponent } from "@src/app/component/game-lineup/game-lineup.component";

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
    GameLineupComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy {

  game: DetailedGame | null = null;
  uiGame!: UiGame;
  isLoading = true;

  readonly colorLightGrey = COLOR_LIGHT_GREY;

  mainClub: SmallClub = environment.mainClub;

  private subscriptions: Subscription[] = [];

  constructor(
    private gameResolver: GameResolver,
    private route: ActivatedRoute,
    private router: Router,
    private translationService: TranslationService,
  ) {
    const game = this.router.getCurrentNavigation()?.extras?.state?.['game'];
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
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  onGameResolved(game: DetailedGame): void {
    this.game = game;
    this.uiGame = convertToUiGame(game, { penalty: () => "(P)", ownGoal: () => "(OG)", score: (tuple) => [tuple[0], tuple[1]].join(":"), minute: (minute) => transformGoalMinute(minute, '.') });
    this.isLoading = false;
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
    if (isDefined(this.game!.competition.parent)) {
      parts.push(this.game!.competition.parent.shortName);
    }

    parts.push(this.game!.competition.shortName);

    let stage = this.game!.stage;
    if (isDefined(stage)) {
      parts.push(processTranslationPlaceholders(stage, this.translationService));
    }

    const round = processTranslationPlaceholders(this.game!.round, this.translationService);
    parts.push(`${isNaN(Number(round)) ? '' : this.translationService.translate('competitionRound.round')} ${round}`);

    return parts.join(' · ');
  }

  getResult(): string {
    const tuple = getGameResult(this.game!);
    
    return tuple !== null ? tuple.join(":") : "-";
  }

  getResultTendencyClass(): string {
    return `result-tendency-${this.game!.resultTendency}`;
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

}
