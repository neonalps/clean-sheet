import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BasicGame, ScoreTuple } from '@src/app/model/game';
import { getGameResult } from '@src/app/module/game/util';
import { SmallClubComponent } from '@src/app/component/small-club/small-club.component';
import { SmallClub } from '@src/app/model/club';
import { isDefined } from '@src/app/util/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-game-overview',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './game-overview.component.html',
  styleUrl: './game-overview.component.css'
})
export class GameOverviewComponent {

  @Input() game!: BasicGame;
  @Input() mainClub!: SmallClub;

  constructor(private readonly translationService: TranslationService) {}

  getHomeTeam(): SmallClub {
    return this.game.isHomeGame ? this.mainClub : this.game.opponent;
  }

  getAwayTeam(): SmallClub {
    return this.game.isHomeGame ? this.game.opponent : this.mainClub;
  }

  getCompetitionName(): string {
    const parts: string[] = [];
    if (isDefined(this.game.competition.parent)) {
      parts.push(this.game.competition.parent.shortName);
    }

    parts.push(this.game.competition.shortName);

    return parts.join(' · ');
  }

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
