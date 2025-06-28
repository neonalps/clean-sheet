import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { ArrowLeftComponent } from '@src/app/icon/arrow-left/arrow-left.component';
import { ArrowRightComponent } from '@src/app/icon/arrow-right/arrow-right.component';
import { FormatGameMinutePipe } from '@src/app/pipe/format-minute.pipe';
import { isDefined } from '@src/app/util/common';

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
  templateUrl: './game-person-item.component.html',
  styleUrl: './game-person-item.component.css'
})
export class GamePersonItemComponent {

  @Input() person!: GamePerson;

  getPersonName(): string {
    return [this.person.firstName, this.person.lastName].filter(item => isDefined(item)).join(" ");
  }

}
