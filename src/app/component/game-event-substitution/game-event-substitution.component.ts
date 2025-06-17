import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiSubstitutionGameEvent } from '@src/app/model/game';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { ArrowLeftComponent } from "@src/app/icon/arrow-left/arrow-left.component";
import { ArrowRightComponent } from '@src/app/icon/arrow-right/arrow-right.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { getPersonName } from '@src/app/util/domain';

@Component({
  selector: 'app-game-event-substitution',
  imports: [CommonModule, GameEventComponent, ArrowLeftComponent, ArrowRightComponent, I18nPipe],
  templateUrl: './game-event-substitution.component.html',
  styleUrl: './game-event-substitution.component.css'
})
export class GameEventSubstitutionComponent {

  @Input() event!: UiSubstitutionGameEvent;

  getPlayerOff(): string {
    return getPersonName(this.event.playerOff);
  }

  getPlayerOn(): string {
    return getPersonName(this.event.playerOn);
  }

}
