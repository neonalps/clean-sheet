import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { BasicGame, GameStatus, ScoreTuple } from '@src/app/model/game';
import { getGameResult } from '@src/app/module/game/util';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { isDefined } from '@src/app/util/common';

@Component({
  selector: 'app-game-score',
  imports: [CommonModule],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.css'
})
export class GameScoreComponent {

  @Input() game!: BasicGame;

  private readonly translationService = inject(TranslationService);

  getResultTendencyClass(): string {
      return `result-tendency-${this.game.resultTendency}`;
    }
  
    hasExtendedPlay(): boolean {
      return isDefined(this.game.afterExtraTime) || isDefined(this.game.penaltyShootOut);
    }
  
    getResult(score: ScoreTuple | null): string {
      return score !== null ? score.join(":") : "-";
    }
  
    getGameScoreBeforePso() {
      if (this.game.status === GameStatus.Scheduled) {
        return "-";
      }
  
      return this.getResult(getGameResult(this.game, false));
    }
  
    getGameScoreAfterPso() {
      return this.getResult(getGameResult(this.game, true));
    }
  
    getExtendedPlayText(): string {
      if (isDefined(this.game.penaltyShootOut)) {
        return this.translationService.translate(`gameResult.pso`, { 'score': this.getGameScoreAfterPso() });
      }
  
      return this.translationService.translate('gameResult.aet');
    }

}
