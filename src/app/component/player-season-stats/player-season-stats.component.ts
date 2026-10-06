import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { CollapsibleComponent } from "@src/app/component/collapsible/collapsible.component";
import { CompetitionStats, StatsPlayerCompetitionComponent } from "@src/app/component/stats-player-competition/stats-player-competition.component";
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { Season } from '@src/app/model/season';
import { PlayerBaseStats } from '@src/app/model/stats';
import { SeasonId } from '@src/app/util/domain-types';

export type StatsBySeasonAndCompetition = {
  season: Season;
  total: PlayerBaseStats;
  competitionStats: CompetitionStats[];
};

export type SeasonCompetitionClickedEvent = {
  seasonId: SeasonId;
  filterOptions: GamePlayedFilterOptions;
};

export type SeasonTotalClickedEvent = {
  seasonId: SeasonId;
  filterItemType: keyof GamePlayedFilterOptions;
};

@Component({
  selector: 'app-player-season-stats',
  imports: [CommonModule, CollapsibleComponent, StatsPlayerCompetitionComponent],
  templateUrl: './player-season-stats.component.html'
})
export class PlayerSeasonStatsComponent implements OnInit {

  readonly seasonStatsItem = input.required<StatsBySeasonAndCompetition>();
  readonly isLastItem = input(false);

  readonly onSeasonCompetitionClicked = output<SeasonCompetitionClickedEvent>();
  readonly onSeasonTotalClicked = output<SeasonTotalClickedEvent>();

  readonly detailsOpen = signal(false);

  ngOnInit(): void {
    this.detailsOpen.set(this.seasonStatsItem().season.isCurrent === true);
  }

  seasonCompetitionClicked(seasonId: SeasonId, filterOptions: GamePlayedFilterOptions) {
    this.onSeasonCompetitionClicked.emit({
      seasonId: seasonId,
      filterOptions: filterOptions,
    });
  }

  seasonTotalClicked(seasonId: SeasonId, filterItemType: keyof GamePlayedFilterOptions) {
    this.onSeasonTotalClicked.emit({
      seasonId: seasonId,
      filterItemType: filterItemType,
    });
  }

  triggerToggle() {
    this.toggle();
  }

  toggle() {
    this.detailsOpen.update(current => !current);
  }

}
