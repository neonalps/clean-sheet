import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-sofascore',
  imports: [],
  templateUrl: './sofascore.component.html'
})
export class SofascoreComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => this.color() ?? KEYWORD_CURRENT_COLOR);

}
