import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RankedPersonItem } from '@src/app/model/dashboard';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { GetPlayerAppearanceStatsResponse, StatsService } from '@src/app/module/stats/service';
import { ToastService } from '@src/app/module/toast/service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ranking-appearances',
  imports: [],
  templateUrl: './ranking-appearances.component.html',
  styleUrl: './ranking-appearances.component.css'
})
export class RankingAppearancesComponent implements OnInit, OnDestroy {

  readonly forMain = input(true);

  readonly appearanceStats = signal<RankedPersonItem[]>([]);

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

  private loadData(): void {
    this.statsService.getPlayerAppearanceStats({
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

    console.log('new stats', updatedAppearanceResultValue);
  }

}
