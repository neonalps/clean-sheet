import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RankedPersonItem } from '@src/app/model/dashboard';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { GetPlayerAppearanceStatsResponse, StatsService } from '@src/app/module/stats/service';
import { ToastService } from '@src/app/module/toast/service';
import { Subject, takeUntil } from 'rxjs';
import { PaginatedRankedPersonListComponent } from "@src/app/component/paginated-ranked-person-list/paginated-ranked-person-list.component";
import { isNotDefined } from '@src/app/util/common';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-ranking-appearances',
  imports: [PaginatedRankedPersonListComponent, I18nPipe],
  templateUrl: './ranking-appearances.component.html',
  styleUrl: './ranking-appearances.component.css'
})
export class RankingAppearancesComponent implements OnInit, OnDestroy {

  readonly forMain = input(true);

  readonly isLoading = signal(false);
  readonly appearanceStats = signal<RankedPersonItem[]>([]);

  private readonly hasReachedEnd = signal(false);

  private readonly nextPageKey = signal<string | null>(null);

  private readonly statsService = inject(StatsService);
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

  onNearEndReached(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.hasReachedEnd() === true || this.isLoading() === true) {
      return;
    }

    this.isLoading.set(true);
    this.statsService.getPlayerAppearanceStats(this.nextPageKey(), {
      forMain: this.forMain(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: appearanceStats => this.onAppearanceStatsResult(appearanceStats),
      error: (err) => {
        console.error(err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate(`playerAppearanceStats.error`) });
      }
    })
  }

  private onAppearanceStatsResult(result: GetPlayerAppearanceStatsResponse): void {
    const updatedAppearanceResultValue = [...this.appearanceStats(), ...result.items];
    this.appearanceStats.set(updatedAppearanceResultValue);
    this.nextPageKey.set(result.nextPageKey ?? null);

    if (isNotDefined(result.nextPageKey)) {
      this.hasReachedEnd.set(true);
    }
    this.isLoading.set(false);
  }

}
