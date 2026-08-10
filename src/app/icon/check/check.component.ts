import { Component, computed, input, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-check',
  imports: [],
  templateUrl: './check.component.html'
})
export class CheckComponent {

  color = input<string>();

  effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
