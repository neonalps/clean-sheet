import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-goalkeeper-goal',
  imports: [],
  templateUrl: './goalkeeper-goal.component.html',
  styleUrl: './goalkeeper-goal.component.css'
})
export class GoalkeeperGoalComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
