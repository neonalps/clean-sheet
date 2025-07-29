import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RoundGamesComponent } from "@src/app/component/round-games/round-games.component";
import { RoundTableComponent } from "@src/app/component/round-table/round-table.component";
import { MatchdayDetails } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-round-information',
  imports: [CommonModule, I18nPipe, RoundGamesComponent, RoundTableComponent],
  templateUrl: './round-information.component.html',
  styleUrl: './round-information.component.css'
})
export class RoundInformationComponent {

  @Input() loading = true;
  @Input() matchdayDetails?: MatchdayDetails;
  @Input() hideTable = false;

  private readonly translationService = inject(TranslationService);

  getTableAfterRoundText(): string | null {
    if (!this.matchdayDetails) {
      return null;
    }

    return this.translationService.translate('matchdayDetails.tableAfterRound', { round: this.matchdayDetails.competitionRound });
  }

}
