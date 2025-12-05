import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiCardGameEvent } from '@src/app/model/game';
import { isDefined } from '@src/app/util/common';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-game-event-card',
  imports: [CommonModule, GameEventComponent],
  templateUrl: './game-event-card.component.html',
  styleUrl: './game-event-card.component.css'
})
export class GameEventCardComponent {

  @Input() event!: UiCardGameEvent;

  constructor(private readonly translationService: TranslationService) {}

  getPersonName(): string {
    if (this.event.affectedPlayer) {
      return [this.event.affectedPlayer.firstName, this.event.affectedPlayer.lastName].filter(item => isDefined(item)).join(' ');
    } else if (this.event.affectedManager) {
      return [this.event.affectedManager.firstName, this.event.affectedManager.lastName].filter(item => isDefined(item)).join(' ');
    }

    throw new Error(`Should not be reachable`);
  }

  getReason(): string {
    return this.translationService.translate(`reason.${this.event.reason}`);
  }

  isVarEvent(): boolean {
    return this.event.var === true;
  }

}
