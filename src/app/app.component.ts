import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeasonService } from './module/season/service';
import { filter, map } from 'rxjs';
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
import { CompetitionService } from './module/competition/service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastsComponent, ModalsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly title = 'clean-sheet';

  private readonly appLoadService = inject(AppLoadService);
  private readonly authService = inject(AuthService);
  private readonly competitionService = inject(CompetitionService);
  private readonly seasonService = inject(SeasonService);
  private readonly menuService = inject(MenuService);
  private readonly modalService = inject(ModalService);
  private readonly translationService = inject(TranslationService);

  constructor() {
    effect(() => {
      this.disallowScroll(this.modalService.active());
    });

    effect(() => {
      this.disallowScroll(this.menuService.active());
    });
  }

  ngOnInit(): void {
    this.authService.init();
    this.seasonService.init();
    this.competitionService.init();
    this.translationService.init(this.authService.profileSettings$.pipe(filter(value => isDefined(value)), map(value => value.language)));
    this.appLoadService.processEntry();
  }

  private disallowScroll(disallow: boolean) {
    if (disallow) {
      window.document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    } else {
      window.document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    }
  }
}
