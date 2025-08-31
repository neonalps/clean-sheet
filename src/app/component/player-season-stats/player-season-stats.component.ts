import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CollapsibleComponent } from "@src/app/component/collapsible/collapsible.component";
import { CompetitionStats, StatsPlayerCompetitionComponent } from "@src/app/component/stats-player-competition/stats-player-competition.component";
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { Season } from '@src/app/model/season';
import { PlayerBaseStats } from '@src/app/model/stats';
import { SeasonId } from '@src/app/util/domain-types';
import { Subject } from 'rxjs';

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
  templateUrl: './player-season-stats.component.html',
  styleUrl: './player-season-stats.component.css'
})
export class PlayerSeasonStatsComponent implements OnDestroy {

  @Input() seasonStatsItem!: StatsBySeasonAndCompetition;
  @Input() isLastItem = false;

  @Output() onSeasonCompetitionClicked = new EventEmitter<SeasonCompetitionClickedEvent>();
  @Output() onSeasonTotalClicked = new EventEmitter<SeasonTotalClickedEvent>();

  readonly toggle$ = new Subject<void>();

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  seasonCompetitionClicked(seasonId: SeasonId, filterOptions: GamePlayedFilterOptions) {
    this.onSeasonCompetitionClicked.next({
      seasonId: seasonId,
      filterOptions: filterOptions,
    });
  }

  seasonTotalClicked(seasonId: SeasonId, filterItemType: keyof GamePlayedFilterOptions) {
    this.onSeasonTotalClicked.next({
      seasonId: seasonId,
      filterItemType: filterItemType,
    });
  }

  triggerToggle() {
    this.toggle$.next();
  }

}
