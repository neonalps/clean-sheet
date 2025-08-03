import { Component, Input } from '@angular/core';
import { SmallCompetition } from '@src/app/model/competition';
import { PlayerBaseStats } from '@src/app/model/stats';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { CommonModule } from '@angular/common';

export type CompetitionStats = {
  competition: SmallCompetition;
  stats: PlayerBaseStats;
};

@Component({
  selector: 'app-stats-player-competition',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './stats-player-competition.component.html',
  styleUrl: './stats-player-competition.component.css'
})
export class StatsPlayerCompetitionComponent {

  @Input() competitionStats!: ReadonlyArray<CompetitionStats>;

}
