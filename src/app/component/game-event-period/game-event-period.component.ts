import { Component, computed, inject, input } from '@angular/core';
import { DividerComponent } from "@src/app/component/divider/divider.component";
import { UiGameEvent } from '@src/app/model/game';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { isNotDefined } from '@src/app/util/common';

@Component({
  selector: 'app-game-event-period',
  imports: [DividerComponent],
  templateUrl: './game-event-period.component.html',
  styleUrl: './game-event-period.component.css'
})
export class GameEventPeriodComponent {

  private static PERIOD_MAP = new Map([
    ['HT', 'halfTime'],
    ['FT', 'fullTime'],
    ['ET', 'extraTime'],
    ['PSO', 'penaltyShootOut'],
  ]);

  private readonly translationService = inject(TranslationService);

  readonly event = input.required<UiGameEvent>();
  readonly periodText = input<string>();
  readonly isTransparent = input(false);
  readonly textSize = input<string>();
  readonly bgColor = input<string>();
  readonly additionalClasses = input<string>();

  readonly effectivePeriodText = computed(() => this.periodText() ?? this.translationService.translate(this.getTranslationKey(this.event().baseMinute)));

  private getTranslationKey(period: string): string {
    const key = GameEventPeriodComponent.PERIOD_MAP.get(period);
    if (isNotDefined(key)) {
      return `could not find period map key for key '${period}'`;
    }
    return `period.${(key as string)}`;
  }

}
