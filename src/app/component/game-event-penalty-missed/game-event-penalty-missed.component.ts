import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { UiPenaltyMissedGameEvent, UiPerson } from '@src/app/model/game';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getPersonName } from '@src/app/util/domain';

@Component({
  selector: 'app-game-event-penalty-missed',
  imports: [CommonModule, GameEventComponent],
  templateUrl: './game-event-penalty-missed.component.html',
  styleUrl: './game-event-penalty-missed.component.css'
})
export class GameEventPenaltyMissedComponent {

  @Input() event!: UiPenaltyMissedGameEvent;

  constructor(private readonly translationService: TranslationService) {}

  getReason(): string {;
    return this.event.reason === 'saved' ? `${this.translationService.translate('savedBy')} ${this.getGoalkeeperName()}` : this.translationService.translate(`reason.${this.event.reason}`);
  }
  
  getTakenByName(): string {
    return getPersonName(this.event.takenBy);
  }

  private getGoalkeeperName(): string {
    return getPersonName(this.event.goalkeeper);
  }

}
