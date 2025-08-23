import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { MainFlagComponent } from "@src/app/component/main-flag/main-flag.component";
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AuthService } from '@src/app/module/auth/service';
import { AccountRole } from '@src/app/model/auth';

type MenuSection = {
  i18nKey: string;
  isOnlyVisibleTo?: AccountRole[];
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
export class NavMenuComponent implements OnInit, OnDestroy {

  readonly menuSections$ = new BehaviorSubject<MenuSection[]>([]);

  @Output() onNavigationSelected = new EventEmitter<string>();

  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.authService.authIdentity$
      .pipe(takeUntil(this.destroy$))
      .subscribe(identity => {
        if (identity === null) {
          this.menuSections$.next([]);
          return;
        }

        const visibleSections = this.resolveMenuSectionsForRole(identity.role);
        this.menuSections$.next(visibleSections);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.subscribe();
  }

  navItemClicked(target: string) {
    this.onNavigationSelected.next(target);
  }

  private resolveMenuSectionsForRole(role: AccountRole): MenuSection[] {
    return [
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
        isOnlyVisibleTo: [AccountRole.Manager],
        items: [
          {
            target: '/user-list',
            i18nKey: 'menu.users',
          },
          {
            target: '/create-game',
            i18nKey: 'menu.createGame',
          }
        ]
      },
    ].filter(item => {
      return item.isOnlyVisibleTo === undefined || item.isOnlyVisibleTo.includes(role);
    });
  }

}
