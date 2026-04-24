import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-icon-stadium',
  imports: [],
  templateUrl: './stadium.component.html',
})
export class StadiumIconComponent {

  readonly color = input<string | undefined>(undefined);
  readonly effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
