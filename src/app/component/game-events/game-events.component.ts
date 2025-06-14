import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiCardGameEvent, UiGameEvent, UiGoalGameEvent, UiInjuryTimeGameEvent, UiPenaltyMissedGameEvent, UiPenaltyShootOutGameEvent, UiSubstitutionGameEvent, UiVarDecisionGameEvent } from '@src/app/model/game';
import { GameEventGoalComponent } from "@src/app/component/game-event-goal/game-event-goal.component";
import { GameEventCardComponent } from "@src/app/component/game-event-card/game-event-card.component";
import { GameEventVarDecisionComponent } from "@src/app/component/game-event-var-decision/game-event-var-decision.component";
import { GameEventPenaltyMissedComponent } from "@src/app/component/game-event-penalty-missed/game-event-penalty-missed.component";
import { GameEventSubstitutionComponent } from "@src/app/component/game-event-substitution/game-event-substitution.component";
import { GameEventPeriodComponent } from "@src/app/component/game-event-period/game-event-period.component";
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { GameEventPsoComponent } from "@src/app/component/game-event-pso/game-event-pso.component";

@Component({
  selector: 'app-game-events',
  imports: [CommonModule, GameEventGoalComponent, GameEventCardComponent, GameEventPenaltyMissedComponent, GameEventVarDecisionComponent, GameEventSubstitutionComponent, GameEventPeriodComponent, GameEventPsoComponent],
  templateUrl: './game-events.component.html',
  styleUrl: './game-events.component.css'
})
export class GameEventsComponent {

  constructor(private readonly translationService: TranslationService) {}

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

  getPenaltyShootOutGameEvent(event: UiGameEvent): UiPenaltyShootOutGameEvent {
    return event as UiPenaltyShootOutGameEvent;
  }

  getSubstitutionGameEvent(event: UiGameEvent): UiSubstitutionGameEvent {
    return event as UiSubstitutionGameEvent;
  }

  getVarDecisionGameEvent(event: UiGameEvent): UiVarDecisionGameEvent {
    return event as UiVarDecisionGameEvent;
  }

  getInjuryTimeGameEvent(event: UiGameEvent): UiInjuryTimeGameEvent {
    return event as UiInjuryTimeGameEvent;
  }

  getInjuryTimePeriodText(event: UiGameEvent): string {
    const minutes = (event as UiInjuryTimeGameEvent).additionalMinutes;
    return `${this.translationService.translate('period.injuryTime')}: ${minutes} ${this.translationService.translate(minutes === 1 ? 'duration.minute' : 'duration.minutes')}`;
  }

}
