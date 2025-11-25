import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR, KEYWORD_TRANSPARENT } from '@src/styles/constants';

@Component({
  selector: 'app-star-icon',
  imports: [],
  templateUrl: './star.component.html',
})
export class StarIconComponent {

  @Input() color?: string;
  @Input() fillColor?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

  getFillColor(): string {
    return this.fillColor || KEYWORD_TRANSPARENT;
  }

}
