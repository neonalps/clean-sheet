import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-penalty-missed-icon',
  imports: [],
  templateUrl: './penalty-missed.component.html',
})
export class PenaltyMisedIconComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}