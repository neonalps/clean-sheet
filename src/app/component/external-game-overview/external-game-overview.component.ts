import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Fixture, GameStatus, ScoreTuple } from '@src/app/model/game';
import { isDefined } from '@src/app/util/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { SmallClub } from '@src/app/model/club';
import { SmallClubComponent } from '@src/app/component/small-club/small-club.component';

@Component({
  selector: 'app-external-game-overview',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './external-game-overview.component.html',
  styleUrl: './external-game-overview.component.css'
})
export class ExternalGameOverviewComponent {

  @Input() fixture!: Fixture;
  @Input() showYear = false;

  constructor(private readonly translationService: TranslationService) {}

  getHomeTeam(): SmallClub {
    return this.fixture.home;
  }

  getAwayTeam(): SmallClub {
    return this.fixture.away;
  }

  getResultTendencyClass(): string {
    return `result-tendency-d`;
  }

  getDateText() {
    return new DatePipe('en-US').transform(this.fixture.kickoff, this.getDateFormat());
  }

  private getDateFormat(): string {
    return `EEE, MMM d ${this.showYear ? 'YYYY' : ''} - HH:mm`
  }

  hasExtendedPlay(): boolean {
    return isDefined(this.fixture.afterExtraTime) || isDefined(this.fixture.afterPenaltyShootOut);
  }

  getResult(score: ScoreTuple | null): string {
    return score !== null ? score.join(":") : "-";
  }

  getGameScoreBeforePso() {
    if (this.fixture.status === GameStatus.Scheduled) {
      return "-";
    }

    return this.getResult(this.getGameScore(false));
  }

  getGameScoreAfterPso() {
    return this.getResult(this.getGameScore(true));
  }

  getExtendedPlayText(): string {
    if (isDefined(this.fixture.afterPenaltyShootOut)) {
      return this.translationService.translate(`gameResult.pso`, { 'score': this.getGameScoreAfterPso() });
    }

    return this.translationService.translate('gameResult.aet');
  }

  private getGameScore(includePso = false): ScoreTuple {
    if (includePso && this.fixture.afterPenaltyShootOut) {
      return this.fixture.afterPenaltyShootOut;
    }

    if (this.fixture.afterExtraTime) {
      return this.fixture.afterExtraTime;
    }

    return this.fixture.fullTime;
  }


}
