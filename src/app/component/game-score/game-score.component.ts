import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { BasicGame, GameStatus, ScoreTuple } from '@src/app/model/game';
import { getGameResult } from '@src/app/module/game/util';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ScoreFormatter } from '@src/app/module/game/score-formatter';
import { isDefined } from '@src/app/util/common';

@Component({
  selector: 'app-game-score',
  imports: [CommonModule],
  templateUrl: './game-score.component.html'
})
export class GameScoreComponent {

  private readonly scoreFormatter = inject(ScoreFormatter);
  private readonly translationService = inject(TranslationService);

  readonly game = input.required<BasicGame>();
  readonly hideExtendedPlayText = input(false);

  readonly resultTendencyClass = computed(() => `result-tendency-${this.game().resultTendency}`);

  readonly hasExtendedPlay = computed<boolean>(() => {
    const game = this.game();
    return isDefined(game.afterExtraTime) || isDefined(game.penaltyShootOut);
  });

  readonly scoreBeforePso = computed(() => {
    const game = this.game();

    if (game.status === GameStatus.Scheduled) {
      return "-";
    }

    return this.getResult(getGameResult(game, false));
  });

  readonly scoreAfterPso = computed(() => this.getResult(getGameResult(this.game(), true)));

  readonly extendedPlayText = computed(() => {
    if (isDefined(this.game().penaltyShootOut)) {
      return this.translationService.translate(`gameResult.pso`, { 'score': this.scoreAfterPso() });
    }

    return this.translationService.translate('gameResult.aet');
  });
  
  private getResult(score: ScoreTuple | null): string {
    if (score === null) {
      return '-';
    }

    return this.scoreFormatter.format(score);
  }

}
