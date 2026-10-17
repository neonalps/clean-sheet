import { CommonModule } from '@angular/common';
import { Component, input, Input, signal } from '@angular/core';

@Component({
  selector: 'app-stepper-item',
  imports: [CommonModule],
  templateUrl: './stepper-item.component.html'
})
export class StepperItemComponent {

  readonly stepId = input.required<string>();
  readonly displayName = input('');

  readonly active = signal(false);
  readonly completed = signal(false);
  readonly disabled = signal(false);
  readonly hidden = signal(false);

}
