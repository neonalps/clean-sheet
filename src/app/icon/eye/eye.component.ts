import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-eye-icon',
  imports: [],
  templateUrl: './eye.component.html',
})
export class EyeIconComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
