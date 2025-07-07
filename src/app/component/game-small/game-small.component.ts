import { Component, Input } from '@angular/core';
import { BasicGame } from '@src/app/model/game';
import { GameScoreComponent } from "@src/app/component/game-score/game-score.component";
import { ClubIconComponent } from "@src/app/component/club-icon/club-icon.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-small',
  imports: [CommonModule, GameScoreComponent, ClubIconComponent],
  templateUrl: './game-small.component.html',
  styleUrl: './game-small.component.css'
})
export class GameSmallComponent {

  @Input() game!: BasicGame;
  @Input() showGameDate = false;

}
