import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { BasicGame, GameStatus, ScoreTuple, UserBasicGame } from "@src/app/model/game";
import { SortOrder } from "@src/app/model/pagination";
import { GameService, GetGamesRequest } from "@src/app/module/game/service";
import { Nullish } from "@src/app/util/types";
import { filter, map, Subject, take, takeUntil } from "rxjs";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { getGameResult } from "@src/app/module/game/util";
import { ScoreFormatter } from "@src/app/module/game/score-formatter";
import { EyeIconComponent } from "@src/app/icon/eye/eye.component";
import { StarIconComponent } from "@src/app/icon/star/star.component";
import { ensureNotNullish, isDefined } from "@src/app/util/common";
import { I18nPipe } from "@src/app/module/i18n/i18n.pipe";
import { FilterButtonComponent } from "@src/app/component/filter-button/filter-button.component";
import { ModalService } from "@src/app/module/modal/service";
import { FilterGameListPayload } from "@src/app/component/modal-game-list-filter/modal-game-list-filter.component";
import { GameListFilterItem, GameListFilterType } from "@src/app/module/filter/service";
import { LocalStorageStorageProvider } from "@src/app/module/storage/local-storage";
import { TranslationService } from "@src/app/module/i18n/translation.service";
import { getGameListFilterTypeOptions } from "@src/app/module/filter/game-list-filter";

@Component({
  selector: 'app-game-table',
  imports: [CommonModule, UiIconComponent, EyeIconComponent, StarIconComponent, I18nPipe, FilterButtonComponent],
  templateUrl: './game-table.component.html'
})
export class GameTableComponent implements OnInit, OnDestroy {

  private static readonly STORAGE_KEY_GAME_TABLE_FILTER = 'filterGameTable';

  readonly currentPage = signal(-1);
  readonly isLoading = signal(false);
  readonly nextPageKey = signal<Nullish<string>>(null);
  readonly hasNextPage = signal(true);
  readonly pageSize = signal(20);
  readonly sortOrder = signal(SortOrder.Descending);
  readonly gameListFilters = signal<GameListFilterItem[]>([]);
  readonly isFiltering = computed(() => {
    return !this.isLoading() && this.gameListFilters().length > 0;
  });
  readonly currentlyShowingText = signal('filtering');

  private readonly games = signal<UserBasicGame[]>([]);
  readonly visibleGames = computed(() => {
    const currentPageValue = this.currentPage();
    if (currentPageValue < 0) {
      return [];
    }

    const startElement = this.currentPage() * this.pageSize();
    return [...this.games().slice(startElement, startElement + this.pageSize())];
  });

  private readonly gameService = inject(GameService);
  private readonly localStorageService = inject(LocalStorageStorageProvider);
  private readonly modalService = inject(ModalService);
  private readonly scoreFormatter = inject(ScoreFormatter);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
      this.loadTable();
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  onGameClicked(game: BasicGame) {
    
  }

  showFilterModal() {
    this.modalService.showFilterGameListModal({
      availableFilterTypeOptions: getGameListFilterTypeOptions(this.translationService),
      gameListFilterItems: this.gameListFilters(),
    }).pipe(
        filter(event => event.type === 'confirm'),
        map(event => ensureNotNullish(event.value) as FilterGameListPayload),
        takeUntil(this.destroy$),
    ).subscribe(value => {
      this.setAndApplyGameFilters([...value.gameListFilterItems]);
    });
  }

  setAndApplyGameFilters(filters: GameListFilterItem[]) {
    const previousFilters = this.gameListFilters();
    const updatedFilters = [...filters];

    if (previousFilters.length === updatedFilters.length && previousFilters.every(item => updatedFilters.some(innerItem => innerItem.id === item.id && item.value === innerItem.value))) {
      console.log('filters are the same, no need to fetch again');
      return;
    }

    if (this.hasNonEmptyFilters(updatedFilters)) {
      this.gameListFilters.set(updatedFilters);
      this.localStorageService.set(GameTableComponent.STORAGE_KEY_GAME_TABLE_FILTER, updatedFilters);
      this.currentlyShowingText.set(this.translationService.translate('list.currentlyActiveFilters', { plural: updatedFilters.length }));
    }

    this.resetPagination();
    this.loadTable();
  }

  getResult(score: ScoreTuple | null): string {
    return this.scoreFormatter.format(score);
  }

  getGameScoreAfterPso(game: BasicGame) {
    return this.getResult(getGameResult(game, true));
  }

  getGameScoreBeforePso(game: BasicGame) {
    if (game.status === GameStatus.Scheduled) {
      return "-";
    }

    return this.getResult(getGameResult(game, false));
  }

  getResultTendencyClass(game: BasicGame): string {
    return `result-tendency-${game.resultTendency}`;
  }

  onBefore() {
    if (this.currentPage() <= 0) {
      return;
    }

    this.currentPage.update(current => current - 1);
  }

  onNext() {
    this.loadTable();
  }

  resetFilters(): void {
    this.gameListFilters.set([]);
    this.localStorageService.remove(GameTableComponent.STORAGE_KEY_GAME_TABLE_FILTER);
    this.resetPagination();
    this.loadTable();
  }

  private resetPagination() {
    this.currentPage.set(-1);
    this.nextPageKey.set(null);
    this.games.set([]);
  }

  private loadTable() {
    if (this.isLoading()) {
      console.warn(`Table is already loading`);
      return;
    }

    if (!this.hasNextPage()) {
      console.warn(`No further page available`);
      return;
    }

    this.isLoading.set(true);

    const currentNextPageKey = this.nextPageKey();
    const nextPageRequestParams = isDefined(currentNextPageKey) ? { nextPageKey: currentNextPageKey } : { limit: this.pageSize(), order: this.sortOrder(), status: GameStatus.Finished };

    const getGameTableRequest: GetGamesRequest = {
      ...this.convertGameFiltersToRequestParams(),
      ...nextPageRequestParams,
    };

    this.gameService.getPaginated(getGameTableRequest)
      .pipe(
        take(1),
      ).subscribe({
        next: response => {
          this.games.update(current => this.sortOrder() === SortOrder.Ascending ? [...response.items, ...current] : [...current, ...response.items]);
          this.nextPageKey.set(response.nextPageKey);
          this.hasNextPage.set(isDefined(response.nextPageKey) )
          this.currentPage.update(current => current + 1);
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        },
      })
  }

  private convertGameFiltersToRequestParams(): Partial<GetGamesRequest> {
    const requestPartial: Partial<GetGamesRequest> = {};

    const currentFilters = this.gameListFilters();

    for (const filter of currentFilters) {
      const filterType = filter.type;

      switch (filterType) {
        case GameListFilterType.HomeGame:
          requestPartial.isHomeGame = true;
          break;
        case GameListFilterType.AwayGame:
          requestPartial.isHomeGame = false;
          break;
        case GameListFilterType.Competition:
          requestPartial.competitionId = (ensureNotNullish(filter.value) as string[]).join(',');
          break;
        case GameListFilterType.AccountAttended:
          requestPartial.hasAccountAttended = true;
          break;
        case GameListFilterType.AccountStarred:
          requestPartial.hasAccountStarred = true;
          break;
        // TODO add others and assertUnreachable
      }
    }

    return requestPartial;
  }

  private hasNonEmptyFilters(filters: GameListFilterItem[]): boolean {
    return filters.some(item => item.type !== null);
  }

}