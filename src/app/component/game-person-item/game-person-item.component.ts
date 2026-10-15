import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { ArrowLeftComponent } from '@src/app/icon/arrow-left/arrow-left.component';
import { ArrowRightComponent } from '@src/app/icon/arrow-right/arrow-right.component';
import { FormatGameMinutePipe } from '@src/app/pipe/format-minute.pipe';
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
  imports: [CommonModule, FormatGameMinutePipe, PlayerIconComponent, ArrowLeftComponent, ArrowRightComponent],
  templateUrl: './game-person-item.component.html'
})
export class GamePersonItemComponent {

  readonly person = input.required<GamePerson>();

  readonly personName = computed(() => getPersonName(this.person()));

}
