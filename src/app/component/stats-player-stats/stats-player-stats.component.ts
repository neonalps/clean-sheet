import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { SmallCompetition } from '@src/app/model/competition';
import { Season } from '@src/app/model/season';
import { PlayerBaseStats, UiPlayerStats } from '@src/app/model/stats';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { processTranslationPlaceholders } from '@src/app/util/common';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { combinePlayerBaseStats, getEmptyPlayerBaseStats } from '@src/app/module/stats/util';
import { filter, Subject, takeUntil } from 'rxjs';
import { CollapsibleComponent } from "@src/app/component/collapsible/collapsible.component";

type CompetitionStats = {
  competition: SmallCompetition;
  stats: PlayerBaseStats;
};

type StatsBySeasonAndCompetition = {
  season: Season;
  total: PlayerBaseStats;
  competitionStats: CompetitionStats[];
  isCurrent: boolean;
};

@Component({
  selector: 'app-stats-player-stats',
  imports: [CommonModule, I18nPipe, UiIconComponent, CollapsibleComponent],
  templateUrl: './stats-player-stats.component.html',
  styleUrl: './stats-player-stats.component.css'
})
export class StatsPlayerStatsComponent implements OnInit, OnDestroy {

  @Input() headerText!: string;
  @Input() performance$!: Subject<UiPlayerStats | null>;

  statsBySeasonAndCompetition: StatsBySeasonAndCompetition[] | null = null;

  private readonly destroy$ = new Subject<void>();
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
        season: seasonItem,
        total: seasonTotal,
        competitionStats: seasonCompetitionStats,
        isCurrent: i === 0,
      });
    }

    return bySeasonAndCompetitionStats;
  }

}
