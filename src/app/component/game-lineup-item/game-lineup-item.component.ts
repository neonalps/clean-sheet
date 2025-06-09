import { Component, Input } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { UiGamePlayer } from '@src/app/model/game';

@Component({
  selector: 'app-game-lineup-item',
  imports: [PlayerIconComponent],
  templateUrl: './game-lineup-item.component.html',
  styleUrl: './game-lineup-item.component.css'
})
export class GameLineupItemComponent {

  @Input() player!: UiGamePlayer;

}
