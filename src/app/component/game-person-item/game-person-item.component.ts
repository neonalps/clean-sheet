import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { UiPersonItem } from '@src/app/model/game';
import { isDefined } from '@src/app/util/common';

@Component({
  selector: 'app-game-person-item',
  imports: [CommonModule, PlayerIconComponent],
  templateUrl: './game-person-item.component.html',
  styleUrl: './game-person-item.component.css'
})
export class GamePersonItemComponent {

  @Input() person!: UiPersonItem;

  getPersonName(): string {
    return [this.person.firstName, this.person.lastName].filter(item => isDefined(item)).join(" ");
  }

}
