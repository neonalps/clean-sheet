import { Component, Input } from '@angular/core';
import { DividerComponent } from "../divider/divider.component";
import { UiGameEvent } from '@src/app/model/game';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { isDefined, isNotDefined } from '@src/app/util/common';

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
    ['AET', 'extraTime'],
    ['PSO', 'pso'],
  ]);

  @Input() event!: UiGameEvent;
  @Input() periodText: string | undefined;
  @Input() isTransparent: boolean = false;
  @Input() textSize: string | undefined;
  @Input() bgColor: string | undefined;
  @Input() additionalClasses: string | undefined;

  constructor(private readonly translationService: TranslationService) {}

  getPeriodText(): string {
    if (isDefined(this.periodText)) {
      return this.periodText;
    }

    const translationKey = this.getTranslationKey(this.event.baseMinute);
    return this.translationService.translate(translationKey);
  }

  private getTranslationKey(period: string): string {
    const key = GameEventPeriodComponent.PERIOD_MAP.get(period);
    if (isNotDefined(key)) {
      return `could not find period map key for key '${period}'`;
    }
    return `period.${(key as string)}`;
  }

}
