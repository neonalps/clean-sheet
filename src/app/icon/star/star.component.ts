import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR, KEYWORD_TRANSPARENT } from '@src/styles/constants';

@Component({
  selector: 'app-star-icon',
  imports: [],
  templateUrl: './star.component.html',
})
export class StarIconComponent {

  readonly color = input<string>();
  readonly fillColor = input<string>();

  readonly effectiveColor = computed(() => this.color() ?? KEYWORD_CURRENT_COLOR);
  readonly effectiveFillColor = computed(() => this.fillColor() ?? KEYWORD_TRANSPARENT);

}
