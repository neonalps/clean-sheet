import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RoundGamesComponent } from "@src/app/component/round-games/round-games.component";
import { RoundTableComponent } from "@src/app/component/round-table/round-table.component";
import { MatchdayDetails } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-round-information',
  imports: [CommonModule, I18nPipe, RoundGamesComponent, RoundTableComponent],
  templateUrl: './round-information.component.html'
})
export class RoundInformationComponent {

  private readonly translationService = inject(TranslationService);

  readonly loading = input(true);
  readonly matchdayDetails = input<MatchdayDetails>();
  readonly hideTable = input(false);

  readonly tableAfterRoundText = computed(() => {
    const details = this.matchdayDetails();

    if (!details) {
      return null;
    }

    return this.translationService.translate('matchdayDetails.tableAfterRound', { round: details.competitionRound });
  });

}
