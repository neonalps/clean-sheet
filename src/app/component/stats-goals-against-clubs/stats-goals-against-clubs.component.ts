import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GoalsAgainstClubStatsItemDto } from '@src/app/model/stats';
import { SmallClubComponent } from "@src/app/component/small-club/small-club.component";
import { GamePlayedFilterOptions } from '@src/app/model/game-played';

@Component({
  selector: 'app-stats-goals-against-clubs',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './stats-goals-against-clubs.component.html',
  styleUrl: './stats-goals-against-clubs.component.css'
})
export class StatsGoalsAgainstClubsComponent {

  @Input() goalsAgainstClubs: Array<GoalsAgainstClubStatsItemDto> = [];
  @Input() stepSize = 5;

  @Output() filterOptionsSelected = new EventEmitter<GamePlayedFilterOptions>();

  getItemWidth(goalsScored: number): string {
    const percentage = Math.round(goalsScored / this.determineMaxGoals() * 100);
    return `${percentage}%`;
  }

  itemClicked(item: GoalsAgainstClubStatsItemDto) {
    this.filterOptionsSelected.next({
      opponentId: `${item.club.id}`,
      goalsScored: '+1',
    });
  }

  private determineMaxGoals(): number {
    const maxPlayerGoals = this.goalsAgainstClubs.reduce((acc, current) => {
      return current.goalsScored > acc ? current.goalsScored : acc;
    }, 0);

    return (Math.floor(maxPlayerGoals / this.stepSize) + 1) * this.stepSize;
  }

}
