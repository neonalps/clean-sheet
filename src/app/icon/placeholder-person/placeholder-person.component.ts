import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-placeholder-person',
  imports: [],
  templateUrl: './placeholder-person.component.html',
})
export class PlaceholderPersonComponent {

  @Input() color?: string;
  
  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
