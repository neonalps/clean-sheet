import { Component, computed, input, output } from '@angular/core';
import { GoalsAgainstClubStatsItemDto } from '@src/app/model/stats';
import { SmallClubComponent } from "@src/app/component/small-club/small-club.component";
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { ProgressBarComponent } from "@src/app/component/progress-bar/progress-bar.component";

type GoalsAgainstClubItem = GoalsAgainstClubStatsItemDto & { percentage: number };

@Component({
  selector: 'app-stats-goals-against-clubs',
  imports: [SmallClubComponent, ProgressBarComponent],
  templateUrl: './stats-goals-against-clubs.component.html'
})
export class StatsGoalsAgainstClubsComponent {

  readonly goalsAgainstClubs = input<GoalsAgainstClubStatsItemDto[]>([]);
  readonly stepSize = input(5);

  readonly filterOptionsSelected = output<GamePlayedFilterOptions>();

  readonly goalsAgainstClubsStats = computed<GoalsAgainstClubItem[]>(() => {
    const stats = this.goalsAgainstClubs();
    const size = this.stepSize();

    const maxPlayerGoals = stats.reduce((acc, current) => {
      return current.goalsScored > acc ? current.goalsScored : acc;
    }, 0);

    const upperDisplayLimit = (Math.floor(maxPlayerGoals / size) + 1) * size;

    return stats.map(item => ({ ...item, percentage: Math.round(item.goalsScored / upperDisplayLimit * 100) }));
  });

  itemClicked(item: GoalsAgainstClubStatsItemDto) {
    this.filterOptionsSelected.emit({
      opponentId: `${item.club.id}`,
      goalsScored: '+1',
    });
  }

}
