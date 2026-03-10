import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-calendar-icon',
  imports: [],
  templateUrl: './calendar-icon.component.html',
  styleUrl: './calendar-icon.component.css'
})
export class CalendarIconComponent {

  @Input() color?: string;
  
  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
