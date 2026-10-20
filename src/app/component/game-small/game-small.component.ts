import { Component, input } from '@angular/core';
import { BasicGame } from '@src/app/model/game';
import { GameScoreComponent } from "@src/app/component/game-score/game-score.component";
import { ClubIconComponent } from "@src/app/component/club-icon/club-icon.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-game-small',
  imports: [DatePipe, GameScoreComponent, ClubIconComponent],
  templateUrl: './game-small.component.html'
})
export class GameSmallComponent {

  readonly game = input.required<BasicGame>();
  readonly showClubIcon = input(true);
  readonly showGameDate = input(false);
  readonly hideExtendedPlayText = input(false);

}
