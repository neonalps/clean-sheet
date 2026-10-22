import { Component, computed, inject, input } from '@angular/core';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { UiVarDecisionGameEvent } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { isNotDefined } from '@src/app/util/common';
import { getPersonName } from '@src/app/util/domain';

@Component({
  selector: 'app-game-event-var-decision',
  imports: [GameEventComponent, I18nPipe],
  templateUrl: './game-event-var-decision.component.html'
})
export class GameEventVarDecisionComponent {

  private readonly translationService = inject(TranslationService);

  readonly event = input.required<UiVarDecisionGameEvent>();

  readonly decision = computed(() => this.translationService.translate(`varDecision.${this.event().decision}`));
  readonly decisionReason = computed(() => {
    const reason = this.event().reason;

    if (isNotDefined(reason)) {
      return null;
    }

    return this.translationService.translate(`varDecisionReason.${reason}`);
  });

  readonly personName = computed(() => getPersonName(this.event().affectedPlayer));

}
