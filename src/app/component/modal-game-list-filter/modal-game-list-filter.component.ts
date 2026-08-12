import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { map, Subject, takeUntil } from 'rxjs';
import { FilterItemComponent } from "@src/app/component/filter/filter-item/filter-item.component";
import { CommonModule } from '@angular/common';
import { GameListFilterItem, GameListFilterType, GenericFilterItem } from '@src/app/module/filter/service';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { MultiSelectComponent } from "@src/app/component/select-multi/select-multi.component";
import { CompetitionService } from '@src/app/module/competition/service';
import { processTranslationPlaceholders } from '@src/app/util/common';

export type FilterGameListPayload = {
  gameListFilterItems: GameListFilterItem[];
}

@Component({
  selector: 'app-modal-game-list-filter',
  imports: [CommonModule, ModalComponent, ButtonComponent, I18nPipe, FilterItemComponent, MultiSelectComponent],
  templateUrl: './modal-game-list-filter.component.html',
  styleUrl: './modal-game-list-filter.component.css'
})
export class ModalGameListFilterComponent implements OnInit, OnDestroy {

  readonly currentFilterItems = signal<GameListFilterItem[]>([]);

  readonly competitionOptions = signal<SelectOption[]>([]);
  readonly selectedCompetitions = signal<OptionId[]>([]);

  private readonly competitionService = inject(CompetitionService);
  private readonly modalService = inject(ModalService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.filterGameListPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentFilterItems.set(payload.gameListFilterItems.length > 0 ? payload.gameListFilterItems : [this.createEmptyGameListFilterItem()]);
      });

    this.competitionService.getOrderedTopLevelCompetitionsFromCache().pipe(
      map(competitions => {
        return competitions.map(item => ({
          id: item.id,
          name: processTranslationPlaceholders(item.shortName, this.translationService),
          icon: item.iconSmall ? { type: 'competition', content: item.iconSmall } : undefined,
        } satisfies SelectOption));
      }),
      takeUntil(this.destroy$),
    ).subscribe((competitionOptions: SelectOption[]) => {
      this.competitionOptions.set(competitionOptions);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem(): void {
    this.currentFilterItems.set([...this.currentFilterItems(), this.createEmptyGameListFilterItem()]);
  }

  onCompetitionSelectionChanged(selectedCompetitionIds: OptionId[]) {
    this.selectedCompetitions.set(selectedCompetitionIds);
  }

  getGameListFilterTypeOptions(): SelectOption[] {
    return [
      { id: GameListFilterType.HomeGame, name: this.translationService.translate(`filter.homeGame`) },
      { id: GameListFilterType.AwayGame, name: this.translationService.translate(`filter.awayGame`) },
      { id: GameListFilterType.Competition, name: this.translationService.translate(`filter.competition`) },
      { id: GameListFilterType.DomesticGame, name: this.translationService.translate(`filter.domesticGame`) },
      { id: GameListFilterType.InternationalGame, name: this.translationService.translate(`filter.internationalGame`) },
      { id: GameListFilterType.ComeFromBehindWin, name: this.translationService.translate(`filter.comeFromBehindWin`) },
      { id: GameListFilterType.WinInInjuryTime, name: this.translationService.translate(`filter.winInInjuryTime`) },
      { id: GameListFilterType.LossAfterLead, name: this.translationService.translate(`filter.lossAfterLead`) },
      { id: GameListFilterType.LossInInjuryTime, name: this.translationService.translate(`filter.lossInInjuryTime`) },
    ]
  }

  onFilterItemChange(payload: GenericFilterItem): void {
    const current = this.currentFilterItems();
    const idxToUpdate = current.findIndex(item => item.id === payload.id);
    if (idxToUpdate < 0) {
      return;
    }

    this.currentFilterItems.update(items => {
      const copy = [...items];
      copy[idxToUpdate] = payload as GameListFilterItem;
      return copy;
    });
  }

  onFilterItemRemove(payload: GenericFilterItem): void {
    const current = this.currentFilterItems();
    const idxToRemove = current.findIndex(item => item.id === payload.id);
    if (idxToRemove < 0) {
      return;
    }

    current.splice(idxToRemove, 1);
    this.currentFilterItems.set(current);
  }

  onCancel() {
    this.modalService.onCancel();
  }

  onConfirm() {
    this.modalService.onConfirm({
      gameListFilterItems: this.currentFilterItems(),
    } satisfies FilterGameListPayload);
  }

  private createEmptyGameListFilterItem(): GameListFilterItem {
    return {
      id: crypto.randomUUID(),
      type: null,
    };
  }

}
