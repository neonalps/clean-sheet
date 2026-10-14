import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { BasicGame } from '@src/app/model/game';
import { GameSmallComponent } from '@src/app/component/game-small/game-small.component';
import { navigateToGameWithoutDetails } from '@src/app/util/router';
import { Router } from '@angular/router';
import { calculatePerformanceTrend } from '@src/app/module/game/util';
import { ProgressCircleComponent } from "@src/app/component/progress-circle/progress-circle.component";

@Component({
  selector: 'app-game-performance-trend',
  imports: [CommonModule, GameSmallComponent, ProgressCircleComponent],
  templateUrl: './game-performance-trend.component.html'
})
export class GamePerformanceTrendComponent {

  readonly games = input.required<BasicGame[]>();
  readonly noGamesText = input.required<string>();
  readonly showGameDate = input(false);
  readonly applyInnerPadding = input(false);
  readonly isLoading = input(true);

  readonly placeholderElements = computed(() => [...Array(Math.max(5 - this.games().length, 0)).keys()]);
  readonly score = computed(() => calculatePerformanceTrend(this.games().map(game => game.resultTendency)));

  private readonly router = inject(Router);

  triggerNavigateToGame(game: BasicGame) {
    navigateToGameWithoutDetails(this.router, game.id, game.season.id);
  }

}
