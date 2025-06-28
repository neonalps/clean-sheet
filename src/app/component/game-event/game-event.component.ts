import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameEventType, UiGameEvent, UiPenaltyShootOutGameEvent } from '@src/app/model/game';
import { COLOR_DANGER_LIGHTER_30, COLOR_SUCCESS } from '@src/styles/constants';
import { FootballComponent } from "@src/app/icon/football/football.component";

@Component({
  selector: 'app-game-event',
  imports: [CommonModule, FootballComponent],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.css'
})
export class GameEventComponent {

  @Input() event!: UiGameEvent;

  isPsoEvent(): boolean {
    return this.event.type === GameEventType.PenaltyShootOut;
  }

  getOutcomeColor(): string {
    return this.isPsoGoal() ? COLOR_SUCCESS : COLOR_DANGER_LIGHTER_30;
  }

  showGameMinute(): boolean {
    return !this.event.baseMinute.startsWith("FT") && !this.event.baseMinute.startsWith("AET") && !this.event.baseMinute.startsWith("APSO");
  }

  private isPsoGoal(): boolean {
    return (this.event as UiPenaltyShootOutGameEvent).result === 'goal';
  }

}
