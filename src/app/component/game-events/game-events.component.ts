import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiGameEvent, UiGoalGameEvent } from '@src/app/model/game';
import { GameEventGoalComponent } from "../game-event-goal/game-event-goal.component";

@Component({
  selector: 'app-game-events',
  imports: [CommonModule, GameEventGoalComponent],
  templateUrl: './game-events.component.html',
  styleUrl: './game-events.component.css'
})
export class GameEventsComponent {

  @Input() events!: UiGameEvent[];

  getGoalGameEvent(event: UiGameEvent): UiGoalGameEvent {
    return event as UiGoalGameEvent;
  }

}
