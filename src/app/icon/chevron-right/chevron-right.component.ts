import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-chevron-right',
  imports: [],
  templateUrl: './chevron-right.component.html'
})
export class ChevronRightComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
