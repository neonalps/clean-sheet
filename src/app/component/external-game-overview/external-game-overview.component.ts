import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { Fixture, GameStatus, ScoreTuple } from '@src/app/model/game';
import { isDefined } from '@src/app/util/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { SmallClubComponent } from '@src/app/component/small-club/small-club.component';
import { ScoreFormatter } from '@src/app/module/game/score-formatter';

@Component({
  selector: 'app-external-game-overview',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './external-game-overview.component.html'
})
export class ExternalGameOverviewComponent {

  private readonly scoreFormatter = inject(ScoreFormatter);
  private readonly translationService = inject(TranslationService);

  readonly fixture = input.required<Fixture>();
  readonly showYear = input(false);

  readonly resultTendencyClass = signal(`result-tendency-d`);

  readonly homeTeam = computed(() => this.fixture().home);

  readonly awayTeam = computed(() => this.fixture().away);

  readonly dateFormat = computed(() => `EEE, MMM d ${this.showYear() ? 'YYYY' : ''} - HH:mm`);

  readonly dateText = computed(() => new DatePipe('en-US').transform(this.fixture().kickoff, this.dateFormat()));

  readonly extendedPlay = computed<boolean>(() => {
    const fixture = this.fixture();
    return isDefined(fixture.afterExtraTime) || isDefined(fixture.afterPenaltyShootOut);
  });

  readonly gameStatus = computed(() => this.fixture().status);

  readonly gameStatusText = computed(() => this.fixture().status === GameStatus.Ongoing ? 'live' : '-');

  readonly gameStatusClasses = computed(() => this.fixture().status === GameStatus.Ongoing ? ['bg-color-info', 'rounded', 'px-2', 'py-1'] : []);

  readonly scoreBeforePso = computed(() => {
    if (this.fixture().status === GameStatus.Scheduled) {
      return "-";
    }

    return this.getResult(this.gameScoreExcludingPso());
  });

  readonly scoreAfterPso = computed(() => this.getResult(this.gameScoreIncludingPso()));

  readonly extendedPlayText = computed(() => {
    if (isDefined(this.fixture().afterPenaltyShootOut)) {
      return this.translationService.translate(`gameResult.pso`, { 'score': this.scoreAfterPso() });
    }

    return this.translationService.translate('gameResult.aet');
  });

  readonly gameScoreIncludingPso = computed(() => this.fixture().afterExtraTime ?? this.gameScoreExcludingPso());

  readonly gameScoreExcludingPso = computed(() => {
    const fixture = this.fixture();
    if (fixture.afterExtraTime) {
      return fixture.afterExtraTime;
    }

    if (fixture.fullTime) {
      return fixture.fullTime;
    }

    return null;
  });

  private getResult(score: ScoreTuple | null): string {
    return this.scoreFormatter.format(score);
  }


}
