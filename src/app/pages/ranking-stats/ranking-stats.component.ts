import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RankedPersonItem } from '@src/app/model/dashboard';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { PlayerStatsResponse, StatsService } from '@src/app/module/stats/service';
import { ToastService } from '@src/app/module/toast/service';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { PaginatedRankedPersonListComponent } from "@src/app/component/paginated-ranked-person-list/paginated-ranked-person-list.component";
import { assertUnreachable, ensureNotNullish, isNotDefined } from '@src/app/util/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PATH_PARAM_RANKING_STATS_TYPE } from '@src/app/util/router';
import { ModalService } from '@src/app/module/modal/service';
import { CompetitionFilterSuccessPayload } from '@src/app/component/modal-competition-filter/modal-competition-filter.component';
import { BasicCompetition } from '@src/app/model/competition';
import { CompetitionService } from '@src/app/module/competition/service';

export type RankingStatsType = 'appearances' | 'goals';
const allowedRankingStatsTypes = ['appearances', 'goals'];

@Component({
  selector: 'app-ranking-appearances',
  imports: [PaginatedRankedPersonListComponent],
  templateUrl: './ranking-stats.component.html',
})
export class RankingStatsComponent implements OnInit, OnDestroy {

  readonly forMain = input(true);

  readonly isLoading = signal(false);
  readonly playerStats = signal<RankedPersonItem[]>([]);
  
  readonly titleText = signal<string>('');

  private readonly orderedTopLevelCompetitionsCache = signal<BasicCompetition[]>([]);
  private readonly hasReachedEnd = signal(false);
  private readonly rankingStatsType = signal<RankingStatsType | null>(null);

  private readonly nextPageKey = signal<string | null>(null);

  private readonly competitionsService = inject(CompetitionService);
  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly statsService = inject(StatsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.router.events.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      if (value instanceof NavigationEnd) {
        const type = ensureNotNullish(this.route.snapshot.paramMap.get(PATH_PARAM_RANKING_STATS_TYPE));
        if (!allowedRankingStatsTypes.includes(type)) {
          throw new Error(`Illegal ranking stats type. Allowed values are: ${allowedRankingStatsTypes.join(', ')}`);
        }
        this.rankingStatsType.set(type as RankingStatsType);
        this.nextPageKey.set(null);
        this.playerStats.set([]);
        this.hasReachedEnd.set(false);

        this.titleText.set(this.translationService.translate(`menu.stats.${type}`));

        this.loadData();
      }
    });
  }

  ngOnInit(): void {
    this.competitionsService.getOrderedTopLevelCompetitionsFromCache().pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      this.orderedTopLevelCompetitionsCache.set([...value]);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNearEndReached(): void {
    this.loadData();
  }

  showFilterModal() {
    this.modalService.showCompetitionFilterModal({
      availableCompetitions: this.orderedTopLevelCompetitionsCache(),
      selectedCompetitionIds: [],
      onlyDomestic: false,
      onlyInternational: false,
    }).pipe(
        filter(event => event.type === 'confirm'),
        map(event => ensureNotNullish(event.value) as CompetitionFilterSuccessPayload),
        takeUntil(this.destroy$),
    ).subscribe(value => {
      console.log('received competition filter payload from modal', value);
    });
  }

  private loadData(): void {
    if (this.hasReachedEnd() === true || this.isLoading() === true) {
      return;
    }

    this.isLoading.set(true);
    const statsType = ensureNotNullish(this.rankingStatsType());
    switch (statsType) {
      case 'appearances':
        this.loadAppearanceStats();
        break;
      case 'goals':
        this.loadGoalStats();
        break;
      default:
        assertUnreachable(statsType);
    }
  }

  private loadAppearanceStats() {
    this.statsService.getPlayerAppearanceStats(this.nextPageKey(), {
      forMain: this.forMain(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: playerStats => this.onPlayerStatsResult(playerStats),
      error: (err) => {
        console.error(err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate(`playerAppearanceStats.error`) });
      }
    });
  }

  private loadGoalStats() {
    this.statsService.getPlayerGoalStats(this.nextPageKey(), {
      forMain: this.forMain(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: playerStats => this.onPlayerStatsResult(playerStats),
      error: (err) => {
        console.error(err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate(`playerAppearanceStats.error`) });
      }
    })
  }

  private onPlayerStatsResult(result: PlayerStatsResponse): void {
    const updatedPlayerStatsResultValue = [...this.playerStats(), ...result.items];
    this.playerStats.set(updatedPlayerStatsResultValue);
    this.nextPageKey.set(result.nextPageKey ?? null);

    if (isNotDefined(result.nextPageKey)) {
      this.hasReachedEnd.set(true);
    }
    this.isLoading.set(false);
  }

}
