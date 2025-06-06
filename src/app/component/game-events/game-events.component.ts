import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiCardGameEvent, UiGameEvent, UiGoalGameEvent, UiPenaltyMissedGameEvent, UiSubstitutionGameEvent, UiVarDecisionGameEvent } from '@src/app/model/game';
import { GameEventGoalComponent } from "../game-event-goal/game-event-goal.component";
import { GameEventCardComponent } from "../game-event-card/game-event-card.component";
import { GameEventVarDecisionComponent } from "../game-event-var-decision/game-event-var-decision.component";
import { GameEventPenaltyMissedComponent } from "../game-event-penalty-missed/game-event-penalty-missed.component";
import { GameEventSubstitutionComponent } from "../game-event-substitution/game-event-substitution.component";
import { GameEventPeriodComponent } from "../game-event-period/game-event-period.component";

@Component({
  selector: 'app-game-events',
  imports: [CommonModule, GameEventGoalComponent, GameEventCardComponent, GameEventPenaltyMissedComponent, GameEventVarDecisionComponent, GameEventSubstitutionComponent, GameEventPeriodComponent],
  templateUrl: './game-events.component.html',
  styleUrl: './game-events.component.css'
})
export class GameEventsComponent {

  @Input() events!: UiGameEvent[];

  getCardGameEvent(event: UiGameEvent): UiCardGameEvent {
    return event as UiCardGameEvent;
  }

  getGoalGameEvent(event: UiGameEvent): UiGoalGameEvent {
    return event as UiGoalGameEvent;
  }

  getPenaltyMissedGameEvent(event: UiGameEvent): UiPenaltyMissedGameEvent {
    return event as UiPenaltyMissedGameEvent;
  }

  getSubstitutionGameEvent(event: UiGameEvent): UiSubstitutionGameEvent {
    return event as UiSubstitutionGameEvent;
  }

  getVarDecisionGameEvent(event: UiGameEvent): UiVarDecisionGameEvent {
    return event as UiVarDecisionGameEvent;
  }

}
