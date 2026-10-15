import { Component, computed, input, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-arrow-right',
  imports: [],
  templateUrl: './arrow-right.component.html'
})
export class ArrowRightComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => this.color() ?? KEYWORD_CURRENT_COLOR);

}
