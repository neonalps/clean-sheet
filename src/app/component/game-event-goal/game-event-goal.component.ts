import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiGoalGameEvent } from '@src/app/model/game';

@Component({
  selector: 'app-game-event-goal',
  imports: [CommonModule],
  templateUrl: './game-event-goal.component.html',
  styleUrl: './game-event-goal.component.css'
})
export class GameEventGoalComponent {

  @Input() event!: UiGoalGameEvent;

}
