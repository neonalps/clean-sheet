import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-location-icon',
  imports: [],
  templateUrl: './location.component.html',
})
export class LocationIconComponent {

  color = input<string>();

  effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
