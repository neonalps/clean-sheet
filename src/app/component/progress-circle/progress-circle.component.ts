import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, input, signal } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-progress-circle',
  imports: [CommonModule],
  templateUrl: './progress-circle.component.html',
  styleUrl: './progress-circle.component.css'
})
export class ProgressCircleComponent implements AfterViewInit {

  readonly percentage = input.required<number>();
  readonly radius = input.required<number>();
  readonly strokeWidth = input(3);
  readonly color = input(COLOR_LIGHT);
  readonly transitionDelayMs = input(0);

  readonly internalValue = signal(0);
  readonly styleAttribute = signal("");
  readonly hidden = signal(true);

  readonly normalizedRadius = computed(() => this.radius() - (this.strokeWidth() * 2));
  readonly circumference = computed(() => this.normalizedRadius() * 2 * Math.PI);
  readonly strokeDashArray = computed(() => {
    const circumferenceValue = this.circumference();
    return `${circumferenceValue} ${circumferenceValue}`;
  });
  readonly strokeDashOffset = computed(() => {
    const circumferenceValue = this.circumference();
    const offset = circumferenceValue - (this.internalValue() / 100) * circumferenceValue;
    return `${offset}`;
  });

  ngAfterViewInit(): void {
    setTimeout(() => {
      const percentageValue = this.percentage();
      this.internalValue.set(percentageValue);
      this.styleAttribute.set(`--from:0; --to:${percentageValue}; --time:.5s;`);
      this.hidden.set(false);
    }, this.transitionDelayMs());
  };
  
}
