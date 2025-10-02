import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeasonService } from './module/season/service';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { ToastsComponent } from "./component/toasts/toasts.component";
import { ModalsComponent } from "./component/modals/modals.component";
import { ModalService } from './module/modal/service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./component/header/header.component";
import { MenuService } from './module/menu/service';
import { AuthService } from './module/auth/service';
import { TranslationService } from './module/i18n/translation.service';
import { isDefined } from './util/common';
import { AppLoadService } from './module/app-load/service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastsComponent, ModalsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'clean-sheet';

  private readonly appLoadService = inject(AppLoadService);
  private readonly authService = inject(AuthService);
  private readonly seasonService = inject(SeasonService);
  private readonly menuService = inject(MenuService);
  private readonly modalService = inject(ModalService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.authService.init();
    this.seasonService.init();
    this.translationService.init(this.authService.profileSettings$.pipe(filter(value => isDefined(value)), map(value => value.language)));
    this.appLoadService.processEntry();

    this.menuService.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.modifyBodyClassList(open);
      });

    this.modalService.active$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.modifyBodyClassList(open);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private modifyBodyClassList(open: boolean) {
    if (open) {
      window.document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    } else {
      window.document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    }
  }
}
