import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { FilterItemComponent } from "@src/app/component/filter/filter-item/filter-item.component";
import { CommonModule } from '@angular/common';
import { GameListFilterItem, GameListFilterType, GenericFilterItem } from '@src/app/module/filter/service';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { MultiSelectComponent } from "@src/app/component/select-multi/select-multi.component";
import { CompetitionService } from '@src/app/module/competition/service';
import { ensureNotNullish, processTranslationPlaceholders } from '@src/app/util/common';
import { ChipGroupComponent, ChipGroupInput } from "@src/app/component/chip-group/chip-group.component";
import { OmitStrict } from '@src/app/util/types';
import { SeasonService } from '@src/app/module/season/service';
import { environment } from '@src/environments/environment';

export type FilterGameListPayload = {
  availableFilterTypeOptions: SelectOption[];
  gameListFilterItems: GameListFilterItem[];
}

@Component({
  selector: 'app-modal-game-list-filter',
  imports: [CommonModule, ModalComponent, ButtonComponent, I18nPipe, FilterItemComponent, MultiSelectComponent, ChipGroupComponent],
  templateUrl: './modal-game-list-filter.component.html',
  styleUrl: './modal-game-list-filter.component.css'
})
export class ModalGameListFilterComponent implements OnInit, OnDestroy {

  private readonly competitionService = inject(CompetitionService);
  private readonly modalService = inject(ModalService);
  private readonly seasonService = inject(SeasonService);
  private readonly translationService = inject(TranslationService);

  readonly currentFilterTypeOptions = signal<SelectOption[]>([]);
  readonly currentFilterItems = signal<GameListFilterItem[]>([]);

  readonly quickFilterChipGroup = signal<ChipGroupInput | null>(null);
  readonly quickFilterItems = signal<GameListFilterItem[]>([]);

  readonly competitionOptions = signal<SelectOption[]>([]);
  readonly seasonOptions = signal<SelectOption[]>([]);
  readonly selectedCompetitions = signal<OptionId[]>([]);
  readonly selectedSeasons = signal<OptionId[]>([]);
  readonly yesNoChipGroupInput = signal<ChipGroupInput>({
    mode: 'single',
    chips: [{
      value: 'yes',
      displayText: this.translationService.translate('toggle.yes'),
      selected: true,
    }, {
      value: 'no',
      displayText: this.translationService.translate('toggle.no'),
      selected: false,
    }],
    dynamicClassNamesChip: ['text-xs'],
  });

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.filterGameListPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentFilterTypeOptions.set(payload.availableFilterTypeOptions);
        this.currentFilterItems.set(payload.gameListFilterItems.length > 0 ? payload.gameListFilterItems : [this.createEmptyGameListFilterItem()]);

        const competitionFilterItem = this.currentFilterItems().find(item => item.type === GameListFilterType.Competition);
        if (competitionFilterItem) {
          this.selectedCompetitions.set(ensureNotNullish(competitionFilterItem.value) as OptionId[]);
        }
        
        const seasonFilterItem = this.currentFilterItems().find(item => item.type === GameListFilterType.Season);
        if (seasonFilterItem) {
          this.selectedSeasons.set(ensureNotNullish(seasonFilterItem.value) as OptionId[]);
        }
      });

    const competition$ = this.competitionService.getOrderedTopLevelCompetitionsFromCache().pipe(
      map(competitions => {
        return competitions.map(item => ({
          id: item.id,
          name: processTranslationPlaceholders(item.shortName, this.translationService),
          icon: item.iconSmall ? { type: 'competition', content: item.iconSmall } : undefined,
        } satisfies SelectOption));
      }),
      takeUntil(this.destroy$),
    );

    const seasons$ = this.seasonService.getOrderedSeasonsFromCache().pipe(
      map(seasons => {
        return seasons.map(item => ({
          id: item.id,
          name: item.name,
        } satisfies SelectOption));
      }),
      takeUntil(this.destroy$),
    );

    combineLatest([
      competition$,
      seasons$,
    ]).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: ([competitionOptions, seasonOptions]) => {
        this.competitionOptions.set(competitionOptions);
        this.seasonOptions.set(seasonOptions);

        const bundesligaCompetition = competitionOptions.find(item => item.id === environment.domesticLeagueId);
        const currentSeason = seasonOptions.length > 0 ? seasonOptions[0] : null;

        // set quick filter to current Bundesliga season
        if (bundesligaCompetition && currentSeason) {
          this.quickFilterChipGroup.set({
            mode: 'single',
            chips: [
              {
                selected: false,
                displayIcon: bundesligaCompetition.icon ? { ...bundesligaCompetition.icon, 'containerClasses': ['width-xs', 'relative', 'top-neg-1'] } : undefined,
                displayText: `${bundesligaCompetition.name} ${currentSeason.name}`,
                value: 'not-used',
                colorMode: {
                  bgColorSelected: 'bg-color-dark-grey-darker',
                  textColorSelected: 'text-light',
                  bgColorHover: 'hover:bg-color-dark-grey-darker',
                }
              }
            ],
          });

          this.quickFilterItems.set([
            { id: crypto.randomUUID(), type: GameListFilterType.Competition, value: [bundesligaCompetition.id] },
            { id: crypto.randomUUID(), type: GameListFilterType.Season, value: [currentSeason.id] },
          ]);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onQuickFilterSelected(): void {
    this.modalService.onConfirm({
      gameListFilterItems: this.quickFilterItems(),
    } satisfies OmitStrict<FilterGameListPayload, 'availableFilterTypeOptions'>)
  }

  isFilterItemRemovable(item: GameListFilterItem): boolean {
    return item.type !== null;
  }

  addItem(): void {
    this.currentFilterItems.update(current => [...current, this.createEmptyGameListFilterItem()]);
  }

  onCompetitionSelectionChanged(selectedCompetitionIds: OptionId[]) {
    this.selectedCompetitions.set(selectedCompetitionIds);

    const competitionFilterItem = this.currentFilterItems().find(item => item.type === GameListFilterType.Competition);
    if (!competitionFilterItem) {
      return;
    }

    this.onFilterItemChange({
      ...competitionFilterItem,
      value: ensureNotNullish(this.selectedCompetitions()),
    });
  }

  onSeasonSelectionChanged(selectedSeasonIds: OptionId[]) {
    this.selectedSeasons.set(selectedSeasonIds);

    const seasonFilterItem = this.currentFilterItems().find(item => item.type === GameListFilterType.Season);
    if (!seasonFilterItem) {
      return;
    }

    this.onFilterItemChange({
      ...seasonFilterItem,
      value: ensureNotNullish(this.selectedSeasons()),
    });
  }

  onFilterItemChange(filterItem: GenericFilterItem): void {
    const current = this.currentFilterItems();
    const idxToUpdate = current.findIndex(item => item.id === filterItem.id);
    if (idxToUpdate < 0) {
      return;
    }

    this.currentFilterItems.update(items => {
      const copy = [...items];
      copy[idxToUpdate] = filterItem as GameListFilterItem;
      return copy;
    });
  }

  onFilterItemRemove(filterItem: GenericFilterItem): void {
    const current = this.currentFilterItems();
    const idxToRemove = current.findIndex(item => item.id === filterItem.id);
    if (idxToRemove < 0) {
      return;
    }

    current.splice(idxToRemove, 1);

    if (current.length === 0) {
      current.push(this.createEmptyGameListFilterItem());
    }

    this.currentFilterItems.set(current);
  }

  onCancel() {
    this.modalService.onCancel();
  }

  onConfirm() {
    this.modalService.onConfirm({
      gameListFilterItems: this.currentFilterItems(),
    } satisfies OmitStrict<FilterGameListPayload, 'availableFilterTypeOptions'>);
  }

  private createEmptyGameListFilterItem(): GameListFilterItem {
    return {
      id: crypto.randomUUID(),
      type: null,
    };
  }

}
