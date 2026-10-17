import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-goalkeeper-glove',
  imports: [],
  templateUrl: './goalkeeper-glove.component.html'
})
export class GoalkeeperGloveComponent {

  readonly color = input<string>();

  readonly effectiveColor = computed(() => this.color() ?? KEYWORD_CURRENT_COLOR);

}
