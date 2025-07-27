import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-football-goal',
  imports: [],
  templateUrl: './football-goal.component.html',
  styleUrl: './football-goal.component.css'
})
export class FootballGoalComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
