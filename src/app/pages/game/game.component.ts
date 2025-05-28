import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '@src/app/component/loading/loading.component';
import { SmallClub } from '@src/app/model/club';
import { DetailedGame } from '@src/app/model/game';
import { GameResolver } from '@src/app/module/game/resolver';
import { GameGoalScoringBoard, getGameResult, getGoalScoringBoard, ScoringBoardItem, transformGoalMinute } from '@src/app/module/game/util';
import { isDefined } from '@src/app/util/common';
import { PATH_PARAM_GAME_ID } from '@src/app/util/router';
import { Subscription, take } from 'rxjs';
import { LargeClubComponent } from "@src/app/component/large-club/large-club.component";
import { TabItemComponent } from "@src/app/component/tab-item/tab-item.component";
import { TabGroupComponent } from '@src/app/component/tab-group/tab-group.component';

export type GameRouteState = {
  game: DetailedGame;
}

@Component({
  selector: 'app-game',
  imports: [CommonModule, LoadingComponent, LargeClubComponent, TabGroupComponent, TabItemComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy {

  game: DetailedGame | null = null;
  scoringBoard: GameGoalScoringBoard | null = null;
  isLoading = true;

  mainClub: SmallClub = {
    id: 1,
    name: "SK Sturm Graz",
    shortName: "Sturm Graz",
    iconSmall: "http://localhost:8020/c/1.png",
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private gameResolver: GameResolver,
    private route: ActivatedRoute,
    private router: Router,
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
    this.scoringBoard = getGoalScoringBoard(game, { localize: transformGoalMinute });
    this.isLoading = false;
  }

  getHomeTeam(): SmallClub {
    return this.game!.isHomeGame ? this.mainClub : this.game!.opponent;
  }

  getAwayTeam(): SmallClub {
    return this.game!.isHomeGame ? this.game!.opponent : this.mainClub;
  }

  getHomeScoringBoard(): ScoringBoardItem[] {
    return this.game!.isHomeGame ? this.scoringBoard!.main : this.scoringBoard!.opponent;
  }

  getAwayScoringBoard(): ScoringBoardItem[] {
    return this.game!.isHomeGame ? this.scoringBoard!.opponent : this.scoringBoard!.main;
  }

  getCompetitionName(): string {
    const parts: string[] = [];
    if (isDefined(this.game!.competition.parent)) {
      parts.push(this.game!.competition.parent.shortName);
    }

    parts.push(this.game!.competition.shortName);

    // TODO i18n
    const round = this.game!.round;
    parts.push(`${isNaN(Number(round)) ? '' : 'Round '}${round}`);

    return parts.join(' · ');
  }

  getResult(): string {
    const tuple = getGameResult(this.game!);
    
    return tuple !== null ? tuple.join(":") : "-";
  }

  getResultTendencyClass(): string {
    return `result-tendency-${this.game!.resultTendency}`;
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
