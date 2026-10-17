import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-football-shoe',
  imports: [],
  templateUrl: './football-shoe.component.html'
})
export class FootballShoeComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => this.color() ?? KEYWORD_CURRENT_COLOR);

}
