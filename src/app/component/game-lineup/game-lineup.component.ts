import { Component, Input } from '@angular/core';
import { TacticalFormation, UiGamePlayer, UiPersonItem, UiTeamLineup } from '@src/app/model/game';
import { GameLineupItemComponent } from "@src/app/component/game-lineup-item/game-lineup-item.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { GamePersonItemComponent } from "@src/app/component/game-person-item/game-person-item.component";
import { assertUnreachable, isDefined, isNotDefined } from '@src/app/util/common';
import { findOrThrow } from '@src/app/util/array';

export type UiLineupItem = {
  person: UiPersonItem;
  additionalClasses?: string;
}

export type UiLineupRow = {
  items: UiLineupItem[];
  additionalClasses?: string;
}

@Component({
  selector: 'app-game-lineup',
  imports: [CommonModule, GameLineupItemComponent, I18nPipe, GamePersonItemComponent],
  templateUrl: './game-lineup.component.html',
  styleUrl: './game-lineup.component.css'
})
export class GameLineupComponent {

  @Input() lineup!: UiTeamLineup;

  getLineup(): UiLineupRow[] {
    const tacticalFormation = this.lineup.tacticalFormation;
    if (isNotDefined(tacticalFormation)) {
      return [];
    }

    const starters = this.getStarters();
    const usePositionGrid = starters.every(item => isDefined(item.positionGrid));

    switch (tacticalFormation) {
      case '442-diamond':
        return this.getLineup442Diamond(starters, usePositionGrid);
      case '4231':
        return this.getLineup4231(starters, usePositionGrid);
      default:
        assertUnreachable(tacticalFormation);
    }
  }

  getStarters(): UiGamePlayer[] {
    return this.lineup.players.slice(0, 11);
  }

  getSubstitutes(): UiGamePlayer[] {
    return this.lineup.players.slice(11);
  }

  getManagers(): UiPersonItem[] {
    return this.lineup.managers;
  }

  getLineup442Diamond(players: UiGamePlayer[], usePositionGrid: boolean): UiLineupRow[] {
    return [
      // strikers
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 10, usePositionGrid ? "61" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 9, usePositionGrid ? "62" : undefined) },
        ],
        additionalClasses: 'mt-4',
      },
      // attacking midfielder
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 8, usePositionGrid ? "51" : undefined) },
        ],
        additionalClasses: 'mt-8',
      },
      // centeral + defensive midfielders
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 7, usePositionGrid ? "41" : undefined), additionalClasses: 'position-modifier-diamond-midfield' },
          { person: this.getByPositionGridOrIndex(players, 6, usePositionGrid ? "31" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 5, usePositionGrid ? "42" : undefined), additionalClasses: 'position-modifier-diamond-midfield' },
        ],
        additionalClasses: 'mt-14',
      },
      // defenders
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 4, usePositionGrid ? "21" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 3, usePositionGrid ? "22" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 2, usePositionGrid ? "23" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 1, usePositionGrid ? "24" : undefined) },
        ],
        additionalClasses: 'mt-8',
      },
      // gk
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 0, usePositionGrid ? "11" : undefined) },
        ],
        additionalClasses: 'mt-8',
      }
    ];

  }

  getLineup4231(players: UiGamePlayer[], usePositionGrid: boolean): UiLineupRow[] {
    return [
      // strikers
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 10, usePositionGrid ? "51" : undefined) },
        ],
        additionalClasses: 'mt-4',
      },
      // centeral + attacking midfielders
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 9, usePositionGrid ? "41" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 8, usePositionGrid ? "42" : undefined), additionalClasses: 'position-modifier-4231-midfield' },
          { person: this.getByPositionGridOrIndex(players, 7, usePositionGrid ? "43" : undefined) },
        ],
        additionalClasses: 'mt-14',
      },
      // defensive midfielders
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 6, usePositionGrid ? "31" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 5, usePositionGrid ? "32" : undefined) },
        ],
        additionalClasses: 'mt-8',
      },
      // defenders
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 4, usePositionGrid ? "21" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 3, usePositionGrid ? "22" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 2, usePositionGrid ? "23" : undefined) },
          { person: this.getByPositionGridOrIndex(players, 1, usePositionGrid ? "24" : undefined) },
        ],
        additionalClasses: 'mt-8',
      },
      // gk
      {
        items: [
          { person: this.getByPositionGridOrIndex(players, 0, usePositionGrid ? "11" : undefined) },
        ],
        additionalClasses: 'mt-8',
      }
    ];

  }

  private getByPositionGridOrIndex(players: Array<UiGamePlayer>, fallbackIndex: number, positionGrid?: string): UiGamePlayer {
    if (isDefined(positionGrid)) {
      return findOrThrow(players, (item) => item.positionGrid === positionGrid, `failed to find item with position grid ${positionGrid}`);
    }

    return players[fallbackIndex];
  }

}
