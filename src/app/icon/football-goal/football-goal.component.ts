import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-football-goal',
  imports: [],
  templateUrl: './football-goal.component.html'
})
export class FootballGoalComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => this.color() ?? KEYWORD_CURRENT_COLOR);

}
