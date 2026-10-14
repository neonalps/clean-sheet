import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CompetitionTitle } from '@src/app/model/season';
import { GameOverviewComponent } from '@src/app/component/game-overview/game-overview.component';

@Component({
  selector: 'app-competition-title',
  imports: [CommonModule, GameOverviewComponent],
  templateUrl: './competition-title.component.html'
})
export class CompetitionTitleComponent {

  readonly competitionTitle = input.required<CompetitionTitle>();

  readonly victoryGame = computed(() => this.competitionTitle().victoryGame);

}
