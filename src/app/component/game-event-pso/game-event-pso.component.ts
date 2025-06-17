import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiPenaltyShootOutGameEvent } from '@src/app/model/game';
import { GameEventComponent } from "@src/app/component/game-event/game-event.component";
import { getPersonName } from '@src/app/util/domain';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-game-event-pso',
  imports: [CommonModule, GameEventComponent],
  templateUrl: './game-event-pso.component.html',
  styleUrl: './game-event-pso.component.css'
})
export class GameEventPsoComponent {

  @Input() event!: UiPenaltyShootOutGameEvent;

  constructor(private readonly translationService: TranslationService) {}

  getMissText(): string | null {
    if (this.event.result === 'goal') {
      return null;
    } else if (this.event.result === 'saved') {
      return this.translationService.translate(`penaltyOutcome.savedBy`, { goalkeeper: this.getGoalkeeperName() });
    }

    return this.translationService.translate(`penaltyOutcome.${this.event.result}`);
  }

  getTakenByName(): string {
    return getPersonName(this.event.takenBy);
  }

  private getGoalkeeperName(): string {
    return getPersonName(this.event.goalkeeper);
  }

}
