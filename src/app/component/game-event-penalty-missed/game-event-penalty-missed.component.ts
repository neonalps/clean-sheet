import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { UiPenaltyMissedGameEvent, UiPerson } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { isDefined } from '@src/app/util/common';

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
    return this.getPersonName(this.event.takenBy);
  }

  private getGoalkeeperName(): string {
    return this.getPersonName(this.event.goalkeeper);
  }

  private getPersonName(person: UiPerson): string {
    return [person.firstName, person.lastName].filter(item => isDefined(item)).join(' ');
  }

}
