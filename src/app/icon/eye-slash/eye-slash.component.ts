import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-eye-slash-icon',
  imports: [],
  templateUrl: './eye-slash.component.html',
})
export class EyeSlashIconComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
