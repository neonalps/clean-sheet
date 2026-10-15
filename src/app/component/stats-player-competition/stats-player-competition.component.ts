import { Component, input, output } from '@angular/core';
import { SmallCompetition } from '@src/app/model/competition';
import { PlayerBaseStats } from '@src/app/model/stats';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { CommonModule } from '@angular/common';
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { CompetitionId } from '@src/app/util/domain-types';

export type CompetitionStats = {
  competition: SmallCompetition;
  stats: PlayerBaseStats;
};

@Component({
  selector: 'app-stats-player-competition',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './stats-player-competition.component.html'
})
export class StatsPlayerCompetitionComponent {

  readonly competitionStats = input.required<CompetitionStats[]>();

  readonly filterOptionsSelected = output<GamePlayedFilterOptions>();

  itemClicked(competitionId: CompetitionId, filterItemType: keyof GamePlayedFilterOptions) {
    this.filterOptionsSelected.emit({
      competitionId: `${competitionId}`,
      [filterItemType]:  filterItemType === 'minutesPlayed' ? '+0' : '+1',
    });
  }

}
