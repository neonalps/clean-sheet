import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-goalkeeper-goal',
  imports: [],
  templateUrl: './goalkeeper-goal.component.html'
})
export class GoalkeeperGoalComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => this.color() ?? KEYWORD_CURRENT_COLOR);

}
