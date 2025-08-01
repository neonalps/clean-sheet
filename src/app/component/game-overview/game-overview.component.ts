import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BasicGame, GameStatus, ScoreTuple } from '@src/app/model/game';
import { getGameResult } from '@src/app/module/game/util';
import { SmallClubComponent } from '@src/app/component/small-club/small-club.component';
import { SmallClub } from '@src/app/model/club';
import { isDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getNumberOfDaysBetween } from '@src/app/util/date';

@Component({
  selector: 'app-game-overview',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './game-overview.component.html',
  styleUrl: './game-overview.component.css'
})
export class GameOverviewComponent {

  @Input() game!: BasicGame;
  @Input() mainClub!: SmallClub;
  @Input() showYear = false;

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

    return parts.map(item => processTranslationPlaceholders(item, this.translationService)).join(' · ');
  }

  getResultTendencyClass(): string {
    return `result-tendency-${this.game.resultTendency}`;
  }

  getDateText() {
    const daysUntil = getNumberOfDaysBetween(new Date(this.game.kickoff), new Date());
    if (daysUntil === 0) {
      return [this.translationService.translate(`date.today`), new DatePipe('en-us').transform(this.game.kickoff, '- HH:mm')].join(' ');
    } else if (daysUntil === 1) {
      return [this.translationService.translate(`date.tomorrow`), new DatePipe('en-us').transform(this.game.kickoff, '- HH:mm')].join(' ');
    } else if (daysUntil === -1) {
      return [this.translationService.translate(`date.yesterday`), , new DatePipe('en-us').transform(this.game.kickoff, '- HH:mm')].join(' ');
    } else {
      return new DatePipe('en-US').transform(this.game.kickoff, this.getDateFormat());
    }
  }

  private getDateFormat(): string {
    return `EEE, MMM d ${this.showYear ? 'YYYY' : ''} - HH:mm`
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

  getDynamicContainerClasses(): string[] {
    const classes = [];

    if (this.game.titleWinningGame === true) {
      classes.push('border-1 border-gold border-solid');
    }

    return classes;
  }

}
