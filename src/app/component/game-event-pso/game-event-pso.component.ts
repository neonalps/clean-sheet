import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiPenaltyShootOutGameEvent } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameEventComponent } from "@src/app/component/game-event/game-event.component";

@Component({
  selector: 'app-game-event-pso',
  imports: [CommonModule, I18nPipe, GameEventComponent],
  templateUrl: './game-event-pso.component.html',
  styleUrl: './game-event-pso.component.css'
})
export class GameEventPsoComponent {

  @Input() event!: UiPenaltyShootOutGameEvent;

  getMissText(): string | null {
    if (this.event.result === 'goal') {
      return null;
    }

    return this.event.result;
  }

}
