import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent {

  readonly displayValue = input.required<string>();
  readonly percentageValue = input.required<number>();
  
  readonly itemWidth = computed(() => `${this.percentageValue()}%`);

}
