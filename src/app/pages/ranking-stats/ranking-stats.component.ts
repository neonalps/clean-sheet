import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RankedPersonItem } from '@src/app/model/dashboard';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { GetPlayerStatsQueryParams, PlayerStatsResponse, StatsService } from '@src/app/module/stats/service';
import { ToastService } from '@src/app/module/toast/service';
import { BehaviorSubject, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { PaginatedRankedPersonListComponent } from "@src/app/component/paginated-ranked-person-list/paginated-ranked-person-list.component";
import { assertUnreachable, ensureNotNullish, isNotDefined, uniqueArrayElements } from '@src/app/util/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PATH_PARAM_RANKING_STATS_TYPE } from '@src/app/util/router';
import { ModalService } from '@src/app/module/modal/service';
import { CompetitionFilterSuccessPayload } from '@src/app/component/modal-competition-filter/modal-competition-filter.component';
import { BasicCompetition } from '@src/app/model/competition';
import { CompetitionService } from '@src/app/module/competition/service';
import { CompetitionId } from '@src/app/util/domain-types';
import { ChipGroupComponent, ChipGroupInput } from "@src/app/component/chip-group/chip-group.component";
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';

export type RankingStatsType = 'appearances' | 'goals';
const allowedRankingStatsTypes = ['appearances', 'goals'];

@Component({
  selector: 'app-ranking-appearances',
  imports: [PaginatedRankedPersonListComponent, ChipGroupComponent],
  templateUrl: './ranking-stats.component.html',
})
export class RankingStatsComponent implements OnInit, OnDestroy {

  readonly forMain = signal(true);

  readonly currentFilters = signal<CompetitionFilterSuccessPayload | null>(null);
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

  private domesticCompetitionIds: CompetitionId[] = [];
  private internationalCompetitionIds: CompetitionId[] = [];

  private readonly mainClub: SmallClub = environment.mainClub;

  readonly forMainChipGroupInput = new BehaviorSubject<ChipGroupInput>({ chips: [
    { selected: true, value: 'forMain', displayText: this.translationService.translate('ranking.forMain', { main: this.mainClub.shortName.split(' ')[0] }) },
    { selected: false, value: 'againstMain', displayText: this.translationService.translate('ranking.againstMain', { main: this.mainClub.shortName.split(' ')[0] }) },
  ], mode: 'single' }).asObservable();

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

        this.titleText.set(this.translationService.translate(`menu.stats.${type}`));

        this.resetLoad();
        this.loadData();
      }
    });
  }

  ngOnInit(): void {
    this.competitionsService.getOrderedTopLevelCompetitionsFromCache().pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      this.orderedTopLevelCompetitionsCache.set([...value]);

      this.domesticCompetitionIds = uniqueArrayElements(value.filter(item => item.isDomestic === true).map(item => item.id));
      this.internationalCompetitionIds = uniqueArrayElements(value.filter(item => item.isDomestic !== true).map(item => item.id));
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNearEndReached(): void {
    this.loadData();
  }

  onForMainChipSelected(selectedValue: string | number | boolean): void {
    this.forMain.set(selectedValue === 'forMain');
    this.resetLoad();
    this.loadData();
  }

  showFilterModal() {
    this.modalService.showCompetitionFilterModal({
      filterOption: this.currentFilters()?.filterOption ?? 'none',
      availableCompetitions: this.orderedTopLevelCompetitionsCache(),
      selectedCompetitionIds: this.currentFilters()?.selectedCompetitionIds ?? [],
    }).pipe(
        filter(event => event.type === 'confirm'),
        map(event => ensureNotNullish(event.value) as CompetitionFilterSuccessPayload),
        takeUntil(this.destroy$),
    ).subscribe(value => {
        if (this.currentFilters() === value) {
          return;
        }

        this.currentFilters.set(value);
        this.resetLoad();
        this.loadData();
    });
  }

  private resetLoad(): void {
    this.nextPageKey.set(null);
    this.playerStats.set([]);
    this.hasReachedEnd.set(false);
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
    const queryParams: GetPlayerStatsQueryParams = {
      forMain: this.forMain(),
    };

    const currentFilters = this.currentFilters();
    if (currentFilters?.selectedCompetitionIds && currentFilters.selectedCompetitionIds.length > 0) {
      queryParams.competitionIds = currentFilters.selectedCompetitionIds;
    } else if (currentFilters?.filterOption === 'domestic') {
      queryParams.competitionIds = [...this.domesticCompetitionIds];
    } else if (currentFilters?.filterOption === 'international') {
      queryParams.competitionIds = [...this.internationalCompetitionIds];
    }

    this.statsService.getPlayerAppearanceStats(this.nextPageKey(), queryParams).pipe(takeUntil(this.destroy$)).subscribe({
      next: playerStats => this.onPlayerStatsResult(playerStats),
      error: (err) => {
        console.error(err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate(`playerAppearanceStats.error`) });
      }
    });
  }

  private loadGoalStats() {
    const queryParams: GetPlayerStatsQueryParams = {
      forMain: this.forMain(),
    };

    const currentFilters = this.currentFilters();
    if (currentFilters?.selectedCompetitionIds && currentFilters.selectedCompetitionIds.length > 0) {
      queryParams.competitionIds = currentFilters.selectedCompetitionIds;
    } else if (currentFilters?.filterOption === 'domestic') {
      queryParams.competitionIds = [...this.domesticCompetitionIds];
    } else if (currentFilters?.filterOption === 'international') {
      queryParams.competitionIds = [...this.internationalCompetitionIds];
    }

    this.statsService.getPlayerGoalStats(this.nextPageKey(), queryParams).pipe(takeUntil(this.destroy$)).subscribe({
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
