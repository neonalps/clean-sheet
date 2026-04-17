import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ApplicationStats, ApplicationStatsService } from '@src/app/module/app-stats/service';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ToastService } from '@src/app/module/toast/service';
import { Subject, takeUntil } from 'rxjs';
import { UiIconDescriptor } from '@src/app/model/icon';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { FormatNumberPipe } from '@src/app/pipe/format-number.pipe';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

export type AppStatsUiItem = {
  icon?: UiIconDescriptor;
  iconClasses?: string;
  text: string;
  value: number;
}

@Component({
  selector: 'app-application-stats',
  imports: [CommonModule, UiIconComponent, FormatNumberPipe, I18nPipe, LoadingComponent],
  templateUrl: './application-stats.component.html',
})
export class ApplicationStatsComponent implements OnInit, OnDestroy {

  readonly appStatsRows = signal<ReadonlyArray<AppStatsUiItem[]>>([]);
  readonly isLoading = signal(false);

  private readonly appStats = signal<ApplicationStats | null>(null);

  private readonly applicationStatsService = inject(ApplicationStatsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    if (this.isLoading() === true) {
      return;
    }

    this.isLoading.set(true);
    this.applicationStatsService.getAppStats()
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe({
        next: stats => {
          this.appStats.set(stats);
          this.appStatsRows.set(this.convertAppStatsToUiItems(stats));
          this.isLoading.set(false);
          console.log(stats);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
          this.toastService.addToast({ type: 'error', text: this.translationService.translate('applicationStats.error') });
        }
      });
  }

  private convertAppStatsToUiItems(appStats: ApplicationStats): ReadonlyArray<AppStatsUiItem[]> {
    return [
      [
        {
          text: this.translationService.translate('applicationStats.accountCount', { plural: appStats.accountCount }),
          value: appStats.accountCount,
        },
        {
          text: this.translationService.translate('applicationStats.gameCount', { plural: appStats.gameCount }),
          value: appStats.gameCount,
        },
        {
          text: this.translationService.translate('applicationStats.personCount', { plural: appStats.personCount }),
          value: appStats.personCount,
        },
      ],
      [
        {
          text: this.translationService.translate('applicationStats.gamePlayerCount', { plural: appStats.gamePlayerCount }),
          value: appStats.gamePlayerCount,
        },
        {
          text: this.translationService.translate('applicationStats.gameEventCount', { plural: appStats.gameEventCount }),
          value: appStats.gameEventCount,
        },
        {
          text: this.translationService.translate('applicationStats.gameRefereeCount', { plural: appStats.gameRefereeCount }),
          value: appStats.gameRefereeCount,
        },
      ],
    ];
  }


}
