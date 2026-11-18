import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-caution-icon',
  imports: [],
  templateUrl: './caution.component.html',
})
export class CautionIconComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
