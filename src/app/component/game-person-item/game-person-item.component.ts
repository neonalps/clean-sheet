import { Component, computed, inject, input } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { ArrowLeftComponent } from '@src/app/icon/arrow-left/arrow-left.component';
import { ArrowRightComponent } from '@src/app/icon/arrow-right/arrow-right.component';
import { GameMinuteFormatter } from '@src/app/module/game/minute-formatter';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { FormatGameMinutePipe } from '@src/app/pipe/format-minute.pipe';
import { isNotDefined } from '@src/app/util/common';
import { getPersonName } from '@src/app/util/domain';

export type GamePerson = {
  firstName?: string;
  lastName: string;
  avatar?: string;
  shirt?: number;
  captain?: boolean;
  on?: string;
  off?: string;
  yellowCard?: string;
  yellowRedCard?: string;
  redCard?: string;
}

@Component({
  selector: 'app-game-person-item',
  imports: [FormatGameMinutePipe, PlayerIconComponent, ArrowLeftComponent, ArrowRightComponent, I18nPipe],
  templateUrl: './game-person-item.component.html'
})
export class GamePersonItemComponent {

  private readonly gameMinuteFormatter = inject(GameMinuteFormatter);
  private readonly translationService = inject(TranslationService);

  readonly person = input.required<GamePerson>();

  readonly personName = computed(() => getPersonName(this.person()));

  readonly redCardDisplayText = computed<string | null>(() => {
    const redCardMinute = this.person().redCard;
    if (isNotDefined(redCardMinute)) {
      return null;
    }

    return redCardMinute !== 'FT' ? this.gameMinuteFormatter.format(redCardMinute) : `(${this.translationService.translate('gameMinute.fullTime')})`;
  });

}
