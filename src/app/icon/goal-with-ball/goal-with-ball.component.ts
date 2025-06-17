import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-goal-with-ball',
  imports: [],
  templateUrl: './goal-with-ball.component.html',
  styleUrl: './goal-with-ball.component.css'
})
export class GoalWithBallComponent {

  @Input() color = COLOR_LIGHT;

}
