import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { MainFlagComponent } from "@src/app/component/main-flag/main-flag.component";

type MenuSection = {
  i18nKey: string;
  items: MenuItem[];
}

type MenuItem = {
  target: string;
  i18nKey: string;
}

@Component({
  selector: 'app-nav-menu',
  imports: [CommonModule, I18nPipe, RouterModule, MainFlagComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {

  readonly menuSections: MenuSection[];

  @Output() onNavigationSelected = new EventEmitter<string>();

  constructor() {
    this.menuSections = [
      {
        i18nKey: 'menu.home',
        items: [
          {
            target: '/dashboard',
            i18nKey: 'menu.dashboard',
          }
        ]
      },
      {
        i18nKey: 'menu.currentSeason',
        items: [
          {
            target: '/season/current/games',
            i18nKey: 'menu.games',
          }
        ]
      },
      {
        i18nKey: 'menu.statistics',
        items: [
          {
            target: '/chat',
            i18nKey: 'menu.chat',
          }
        ]
      },
      {
        i18nKey: 'menu.management',
        items: [
          {
            target: '/create-game',
            i18nKey: 'menu.createGame',
          }
        ]
      },
    ];
  }

  navItemClicked(target: string) {
    this.onNavigationSelected.next(target);
  }

}
