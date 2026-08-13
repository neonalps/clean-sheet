import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-chevron-down',
  imports: [],
  templateUrl: './chevron-down.component.html'
})
export class ChevronDownComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
