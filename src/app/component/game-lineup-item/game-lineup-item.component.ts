import { Component, Input } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { GamePerson } from '../game-person-item/game-person-item.component';

@Component({
  selector: 'app-game-lineup-item',
  imports: [PlayerIconComponent],
  templateUrl: './game-lineup-item.component.html',
  styleUrl: './game-lineup-item.component.css'
})
export class GameLineupItemComponent {

  @Input() player!: GamePerson;

  getPlayerDisplayName(): string {
    const lastName = this.player.lastName;
    const lastNameParts = lastName.split(" ");

    if (lastNameParts.length > 1 && lastName.length > 10) {
      // only return the last part of the last name
      return lastNameParts[lastNameParts.length - 1];
    }

    return lastName;
  }

}
