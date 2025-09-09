import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-filter-icon',
  imports: [],
  templateUrl: './filter.component.html',
})
export class FilterIconComponent {

  @Input() color?: string;
  @Input() fillColor?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

  getFillColor(): string | undefined {
    return this.fillColor;
  }

}
