import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { UiPenaltyShootOutGameEvent } from '@src/app/model/game';
import { GameEventComponent } from "@src/app/component/game-event/game-event.component";
import { getPersonName } from '@src/app/util/domain';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-game-event-pso',
  imports: [CommonModule, GameEventComponent],
  templateUrl: './game-event-pso.component.html'
})
export class GameEventPsoComponent {

  private readonly translationService = inject(TranslationService);

  readonly event = input.required<UiPenaltyShootOutGameEvent>();

  readonly missText = computed<string | null>(() => {
    const event = this.event();
    if (event.result === 'goal') {
      return null;
    } else if (event.result === 'saved') {
      return this.translationService.translate(`penaltyOutcome.savedBy`, { goalkeeper: getPersonName(event.goalkeeper) });
    }

    return this.translationService.translate(`penaltyOutcome.${event.result}`);
  });

  readonly takenByName = computed(() => getPersonName(this.event().takenBy));

}
