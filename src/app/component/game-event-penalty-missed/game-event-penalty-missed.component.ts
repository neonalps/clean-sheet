import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { UiPenaltyMissedGameEvent } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getPersonName } from '@src/app/util/domain';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

@Component({
  selector: 'app-game-event-penalty-missed',
  imports: [CommonModule, GameEventComponent, I18nPipe, UiIconComponent],
  templateUrl: './game-event-penalty-missed.component.html'
})
export class GameEventPenaltyMissedComponent {

  readonly event = input.required<UiPenaltyMissedGameEvent>();

  private readonly translationService = inject(TranslationService);

  readonly goalkeeperName = computed(() => getPersonName(this.event().goalkeeper));

  readonly reason = computed(() => {
    const eventValue = this.event();

    return eventValue.reason === 'saved' ? `${this.translationService.translate('savedBy')} ${this.goalkeeperName()}` : this.translationService.translate(`reason.${eventValue.reason}`);
  });

  readonly takenByName = computed(() => getPersonName(this.event().takenBy));

}
