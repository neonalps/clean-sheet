import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GoalsAgainstClubStatsItemDto } from '@src/app/model/stats';
import { SmallClubComponent } from "@src/app/component/small-club/small-club.component";

@Component({
  selector: 'app-stats-goals-against-clubs',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './stats-goals-against-clubs.component.html',
  styleUrl: './stats-goals-against-clubs.component.css'
})
export class StatsGoalsAgainstClubsComponent {

  @Input() goalsAgainstClubs: Array<GoalsAgainstClubStatsItemDto> = [];
  @Input() stepSize = 5;

  getItemWidth(goalsScored: number): string {
    const percentage = Math.round(goalsScored / this.determineMaxGoals() * 100);
    return `${percentage}%`;
  }

  private determineMaxGoals(): number {
    const maxPlayerGoals = this.goalsAgainstClubs.reduce((acc, current) => {
      return current.goalsScored > acc ? current.goalsScored : acc;
    }, 0);

    return (Math.floor(maxPlayerGoals / this.stepSize) + 1) * this.stepSize;
  }

}
