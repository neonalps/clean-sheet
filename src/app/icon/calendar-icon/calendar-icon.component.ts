import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-calendar-icon',
  imports: [],
  templateUrl: './calendar-icon.component.html',
  styleUrl: './calendar-icon.component.css'
})
export class CalendarIconComponent {

  @Input() color = COLOR_LIGHT;

}
