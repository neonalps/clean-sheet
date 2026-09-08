import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-bicycle-kick-icon',
  imports: [],
  templateUrl: './bicycle-kick.component.html',
})
export class BicycleKickIconComponent {

  color = input<string>();

  effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
