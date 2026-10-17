import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { GameEventType, UiGameEvent, UiPenaltyShootOutGameEvent } from '@src/app/model/game';
import { COLOR_DANGER_LIGHTER_30, COLOR_SUCCESS } from '@src/styles/constants';
import { FootballComponent } from "@src/app/icon/football/football.component";

@Component({
  selector: 'app-game-event',
  imports: [CommonModule, FootballComponent],
  templateUrl: './game-event.component.html'
})
export class GameEventComponent {

  readonly event = input.required<UiGameEvent>();

  readonly isPsoEvent = computed(() => this.event().type === GameEventType.PenaltyShootOut);
  
  readonly isPsoGoal = computed(() => {
    const event = this.event();
    return event.type === GameEventType.PenaltyShootOut && (event as UiPenaltyShootOutGameEvent).result === 'goal';
  })

  readonly outcomeColor = computed(() => this.isPsoGoal() ? COLOR_SUCCESS : COLOR_DANGER_LIGHTER_30);

  readonly showGameMinute = computed(() => {
    const event = this.event();
    return !event.baseMinute.startsWith("FT") && !event.baseMinute.startsWith("AET") && !event.baseMinute.startsWith("APSO") && !event.baseMinute.startsWith("PSO");
  });

  readonly showGap = computed(() => {
    if (!this.isPsoEvent()) {
      return false;
    }

    const psoEvent = this.event() as UiPenaltyShootOutGameEvent;

    const attemptIndex = psoEvent.attemptIndex || 0;
    return !psoEvent.lastAttempt && attemptIndex >= 10 && attemptIndex % 2 === 0;
  });

}
