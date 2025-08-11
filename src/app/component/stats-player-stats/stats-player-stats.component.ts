import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Season } from '@src/app/model/season';
import { PlayerBaseStats, UiPlayerStats } from '@src/app/model/stats';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { processTranslationPlaceholders } from '@src/app/util/common';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { combinePlayerBaseStats, getEmptyPlayerBaseStats } from '@src/app/module/stats/util';
import { filter, Subject, takeUntil } from 'rxjs';
import { CollapsibleComponent } from "@src/app/component/collapsible/collapsible.component";
import { CompetitionStats, StatsPlayerCompetitionComponent } from '@src/app/component/stats-player-competition/stats-player-competition.component';
import { StatsPlayerHeaderComponent } from "@src/app/component/stats-player-header/stats-player-header.component";
import { SeasonService } from '@src/app/module/season/service';
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { CompetitionId, SeasonId } from '@src/app/util/domain-types';

type StatsBySeasonAndCompetition = {
  season: Season;
  total: PlayerBaseStats;
  competitionStats: CompetitionStats[];
};

@Component({
  selector: 'app-stats-player-stats',
  imports: [CommonModule, CollapsibleComponent, I18nPipe, StatsPlayerCompetitionComponent, StatsPlayerHeaderComponent],
  templateUrl: './stats-player-stats.component.html',
  styleUrl: './stats-player-stats.component.css'
})
export class StatsPlayerStatsComponent implements OnInit, OnDestroy {

  @Input() headerText!: string;
  @Input() performance$!: Subject<UiPlayerStats | null>;
  
  @Output() filterOptionsSelected = new EventEmitter<GamePlayedFilterOptions>();

  statsBySeasonAndCompetition: StatsBySeasonAndCompetition[] | null = null;

  private readonly destroy$ = new Subject<void>();
  private readonly seasonService = inject(SeasonService);
  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    this.performance$
      .pipe(
        takeUntil(this.destroy$),
        filter(value => value !== null)
      )
      .subscribe(performance => {
        this.statsBySeasonAndCompetition = this.getBySeasonAndCompetitionStats(performance);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBySeasonAndCompetitionStats(performance: UiPlayerStats): StatsBySeasonAndCompetition[] {
    const bySeasonAndCompetitionStats: StatsBySeasonAndCompetition[] = [];

    const currentSeason = this.seasonService.getCurrentSeason();

    for (let i = 0; i < performance.seasons.length; i++) {
      const seasonItem = performance.seasons[i];
      const seasonCompetitionStats: CompetitionStats[] = [];

      let seasonTotal = getEmptyPlayerBaseStats();
      const seasonCompetitionDetails = performance.bySeasonAndCompetition.get(seasonItem.id) ?? new Map();
      
      for (const seasonCompetitionId of seasonCompetitionDetails.keys()) {
        const competition = performance.competitions.find(item => item.id === seasonCompetitionId)!;
        const stats = seasonCompetitionDetails.get(seasonCompetitionId);
        seasonTotal = combinePlayerBaseStats(seasonTotal, stats);
        seasonCompetitionStats.push({
          competition: {
            ...competition,
            name: processTranslationPlaceholders(competition.name, this.translationService),
            shortName: processTranslationPlaceholders(competition.shortName, this.translationService)
          },
          stats,
        })
      }

      bySeasonAndCompetitionStats.push({
        season: {
          ...seasonItem,
          isCurrent: seasonItem.id === currentSeason?.id,
        },
        total: seasonTotal,
        competitionStats: seasonCompetitionStats,
      });
    }

    return bySeasonAndCompetitionStats;
  }

  seasonTotalClicked(seasonId: SeasonId, filterItemType: keyof GamePlayedFilterOptions) {
    this.filterOptionsSelected.next({
      seasonId: `${seasonId}`,
      [filterItemType]:  filterItemType === 'minutesPlayed' ? '+0' : '+1',
    });
  }

  seasonCompetitionClicked(seasonId: SeasonId, filterOptions: GamePlayedFilterOptions) {
    this.filterOptionsSelected.next({
      ...filterOptions,
      seasonId: `${seasonId}`,
    });
  }

}
