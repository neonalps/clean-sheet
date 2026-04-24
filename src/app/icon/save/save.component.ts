import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-save-icon',
  imports: [],
  templateUrl: './save.component.html',
})
export class SaveIconComponent {

  readonly color = input<string | undefined>(undefined);
  readonly effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
