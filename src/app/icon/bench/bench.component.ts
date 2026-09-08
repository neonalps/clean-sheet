import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-bench-icon',
  imports: [],
  templateUrl: './bench.component.html',
})
export class BenchIconComponent {

  color = input<string>();

  effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
