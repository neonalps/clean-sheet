import { Component, Input } from '@angular/core';
import { UiGameManager, UiGamePlayer, UiTeamLineup } from '@src/app/model/game';
import { GameLineupItemComponent } from "@src/app/component/game-lineup-item/game-lineup-item.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { GamePersonItemComponent } from "@src/app/component/game-person-item/game-person-item.component";

@Component({
  selector: 'app-game-lineup',
  imports: [CommonModule, GameLineupItemComponent, I18nPipe, GamePersonItemComponent],
  templateUrl: './game-lineup.component.html',
  styleUrl: './game-lineup.component.css'
})
export class GameLineupComponent {

  @Input() lineup!: UiTeamLineup;

  getSubstitutes(): UiGamePlayer[] {
    return this.lineup.players.slice(11);
  }

  getManagers(): UiGameManager[] {
    return this.lineup.managers;
  }

}
