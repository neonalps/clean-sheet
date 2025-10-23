import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-goal-with-ball',
  imports: [],
  templateUrl: './goal-with-ball.component.html',
  styleUrl: './goal-with-ball.component.css'
})
export class GoalWithBallComponent {

  @Input() color?: string;
  
  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
