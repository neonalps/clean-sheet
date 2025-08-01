import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SmallCompetition } from '@src/app/model/competition';
import { Season } from '@src/app/model/season';
import { PlayerBaseStats, UiPlayerStats } from '@src/app/model/stats';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { processTranslationPlaceholders } from '@src/app/util/common';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { combinePlayerBaseStats, getEmptyPlayerBaseStats } from '@src/app/module/stats/util';

type CompetitionStats = {
  competition: SmallCompetition;
  stats: PlayerBaseStats;
};

type StatsBySeasonAndCompetition = {
  season: Season;
  total: PlayerBaseStats;
  competitionStats: CompetitionStats[];
};

@Component({
  selector: 'app-stats-player-stats',
  imports: [CommonModule, I18nPipe, UiIconComponent],
  templateUrl: './stats-player-stats.component.html',
  styleUrl: './stats-player-stats.component.css'
})
export class StatsPlayerStatsComponent {

  @Input() performance?: UiPlayerStats;

  private readonly translationService = inject(TranslationService);

  getBySeasonAndCompetitionStats(): StatsBySeasonAndCompetition[] {
    if (!this.performance) {
      return [];
    }

    const bySeasonAndCompetitionStats: StatsBySeasonAndCompetition[] = [];

    for (let i = 0; i < this.performance.seasons.length; i++) {
      const seasonItem = this.performance.seasons[i];
      const seasonCompetitionStats: CompetitionStats[] = [];

      let seasonTotal = getEmptyPlayerBaseStats();
      const seasonCompetitionDetails = this.performance.bySeasonAndCompetition.get(seasonItem.id) ?? new Map();
      
      for (const seasonCompetitionId of seasonCompetitionDetails.keys()) {
        const competition = this.performance.competitions.find(item => item.id === seasonCompetitionId)!;
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
      });
    }

    return bySeasonAndCompetitionStats;
  }

}
