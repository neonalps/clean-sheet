import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [CommonModule],
  templateUrl: './label.component.html'
})
export class LabelComponent {

  readonly content = input.required<string>();
  readonly additionalClasses = input<string[] | string>('');

}
