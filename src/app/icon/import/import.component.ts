import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-import-icon',
  imports: [],
  templateUrl: './import.component.html',
})
export class ImportIconComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
