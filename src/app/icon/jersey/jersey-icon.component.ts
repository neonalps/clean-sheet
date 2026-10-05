import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-jersey-icon',
  imports: [],
  templateUrl: './jersey-icon.component.html',
})
export class JerseyIconComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}