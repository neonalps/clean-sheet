import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-stepper-item',
  imports: [CommonModule],
  templateUrl: './stepper-item.component.html',
  styleUrl: './stepper-item.component.css'
})
export class StepperItemComponent {

  @Input() stepId!: string;
  @Input() displayName!: string;

  active = signal(false);
  completed = signal(false);
  disabled = signal(false);

}
