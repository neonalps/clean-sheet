import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-football-shoe',
  imports: [],
  templateUrl: './football-shoe.component.html',
  styleUrl: './football-shoe.component.css'
})
export class FootballShoeComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
