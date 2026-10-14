import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { BasicGame, GameStatus, ScoreTuple } from '@src/app/model/game';
import { getGameResult } from '@src/app/module/game/util';
import { SmallClubComponent } from '@src/app/component/small-club/small-club.component';
import { SmallClub } from '@src/app/model/club';
import { isDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getNumberOfDaysBetween } from '@src/app/util/date';
import { ScoreFormatter } from '@src/app/module/game/score-formatter';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-game-overview',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './game-overview.component.html'
})
export class GameOverviewComponent {

  private readonly mainClub = environment.mainClub;
  private readonly scoreFormatter = inject(ScoreFormatter);
  private readonly translationService = inject(TranslationService);

  readonly game = input.required<BasicGame>();
  readonly showCompetitionName = input(true);
  readonly showYear = input(false);

  readonly homeTeam = computed<SmallClub>(() => {
    const game = this.game();
    return game.isHomeGame ? this.mainClub : game.opponent;
  });

  readonly awayTeam = computed<SmallClub>(() => {
    const game = this.game();
    return game.isHomeGame ? game.opponent : this.mainClub;
  });

  readonly competitionName = computed<string>(() => {
    const game = this.game();
    const parts: string[] = [];
    if (isDefined(game.competition.parent)) {
      parts.push(game.competition.parent.shortName);
    }

    parts.push(game.competition.shortName);

    return parts.map(item => processTranslationPlaceholders(item, this.translationService)).join(' · ');
  });

  readonly resultTendencyClass = computed<string>(() => `result-tendency-${this.game().resultTendency}`);

  readonly dateText = computed(() => {
    const game = this.game();

    const daysUntil = getNumberOfDaysBetween(new Date(game.kickoff), new Date());
    if (daysUntil === 0) {
      return [this.translationService.translate(`date.today`), new DatePipe('en-us').transform(game.kickoff, '- HH:mm')].join(' ');
    } else if (daysUntil === 1) {
      return [this.translationService.translate(`date.tomorrow`), new DatePipe('en-us').transform(game.kickoff, '- HH:mm')].join(' ');
    } else if (daysUntil === -1) {
      return [this.translationService.translate(`date.yesterday`), , new DatePipe('en-us').transform(game.kickoff, '- HH:mm')].join(' ');
    } else {
      return new DatePipe('en-US').transform(game.kickoff, this.dateFormat());
    }
  });

  readonly dateFormat = computed<string>(() => `EEE, MMM d ${this.showYear() ? 'YYYY' : ''} - HH:mm`);

  readonly hasExtendedPlay = computed<boolean>(() => {
    const game = this.game();
    return isDefined(game.afterExtraTime) || isDefined(game.penaltyShootOut);
  });

  readonly scoreBeforePso = computed<string>(() => {
    const game = this.game();

    if (game.status === GameStatus.Scheduled) {
      return "-";
    }

    return this.getResult(getGameResult(game, false));
  });

  readonly scoreAfterPso = computed<string>(() => this.getResult(getGameResult(this.game(), true)));

  readonly extendedPlayText = computed<string>(() => {
    if (isDefined(this.game().penaltyShootOut)) {
      return this.translationService.translate(`gameResult.pso`, { 'score': this.scoreAfterPso() });
    }

    return this.translationService.translate('gameResult.aet');
  });

  readonly dynamicContainerClasses = computed<string[]>(() => this.game().titleWinningGame ? ['border-1 border-gold border-solid'] : []);

  private getResult(score: ScoreTuple | null): string {
    return this.scoreFormatter.format(score);
  }

}
