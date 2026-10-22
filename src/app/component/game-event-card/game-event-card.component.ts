import { Component, computed, inject, input, signal } from '@angular/core';
import { UiCardGameEvent } from '@src/app/model/game';
import { isDefined } from '@src/app/util/common';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

@Component({
  selector: 'app-game-event-card',
  imports: [GameEventComponent, UiIconComponent],
  templateUrl: './game-event-card.component.html'
})
export class GameEventCardComponent {

  private readonly translationService = inject(TranslationService);

  readonly event = input.required<UiCardGameEvent>();

  readonly notOnPitchText = signal(this.translationService.translate('gameEvent.notOnPitch'));
  readonly varText = signal(this.translationService.translate('abbreviation.var'));

  readonly personName = computed(() => {
    const currentEvent = this.event();

    if (currentEvent.affectedPlayer) {
      return [currentEvent.affectedPlayer.firstName, currentEvent.affectedPlayer.lastName].filter(item => isDefined(item)).join(' ');
    } else if (currentEvent.affectedManager) {
      return [currentEvent.affectedManager.firstName, currentEvent.affectedManager.lastName].filter(item => isDefined(item)).join(' ');
    }

    throw new Error(`Should not be reachable`);
  });
  readonly reasonText = computed(() => this.translationService.translate(`reason.${this.event().reason}`));
  readonly varEvent = computed<boolean>(() => this.event().var === true);

}
