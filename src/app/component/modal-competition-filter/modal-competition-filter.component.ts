import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Competition } from '@src/app/model/competition';
import { ModalService } from '@src/app/module/modal/service';
import { CompetitionId } from '@src/app/util/domain-types';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ModalComponent } from "@src/app/component/modal/modal.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ensureNotNullish, getHtmlInputElementFromEvent, processTranslationPlaceholders, uniqueArrayElements } from '@src/app/util/common';
import { CheckboxChipComponent, CheckboxChipInput, CheckboxChipValueChanged } from '@src/app/component/checkbox-chip/checkbox-chip.component';
import { SelectComponent } from "@src/app/component/select/select.component";
import { SelectOption } from '@src/app/component/select/option';

export type CompetitionFilterOption = 'none' | 'domestic' | 'international' | 'custom';

export type CompetitionFilterPayload = {
  filterOption: CompetitionFilterOption,
  availableCompetitions: Competition[];
  selectedCompetitionIds: CompetitionId[];
}

export type CompetitionFilterSuccessPayload = Pick<CompetitionFilterPayload, 'filterOption' | 'selectedCompetitionIds'>;

@Component({
  selector: 'app-modal-competition-filter',
  imports: [ButtonComponent, CommonModule, ModalComponent, I18nPipe, CheckboxChipComponent, SelectComponent],
  templateUrl: './modal-competition-filter.component.html',
})
export class ModalCompetitionFilterComponent implements OnInit, OnDestroy {

  private static COMPETITION_CHIP_ID_PREFIX = `competition-`;

  private static EMPTY_PAYLOAD: CompetitionFilterPayload = {
    availableCompetitions: [],
    selectedCompetitionIds: [],
    filterOption: 'none',
  }

  readonly currentPayload = signal<CompetitionFilterPayload>(ModalCompetitionFilterComponent.EMPTY_PAYLOAD);
  readonly competitionChips = signal<CheckboxChipInput[]>([]);
  readonly pushSelectedFilterOption$ = new Subject<SelectOption>();
  readonly selectedFilterOption = signal<CompetitionFilterOption>('none');

  private readonly selectedCompetitionIds = signal<CompetitionId[]>([]);

  private readonly modalService = inject(ModalService);
  private readonly translationService = inject(TranslationService);

  private readonly availableFilterOptions: SelectOption[] = [
    { id: 'none', name: this.translationService.translate('competitionFilterOption.none') },
    { id: 'domestic', name: this.translationService.translate('competitionFilterOption.domestic') },
    { id: 'international', name: this.translationService.translate('competitionFilterOption.international') },
    { id: 'custom', name: this.translationService.translate('competitionFilterOption.custom') },
  ];

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.competitionFilterModalPayload$
          .pipe(takeUntil(this.destroy$))
          .subscribe(payload => {
            this.currentPayload.set(payload);
          
            // store the selected competition IDs so we can manage the state within this component
            this.selectedCompetitionIds.set([...payload.selectedCompetitionIds]);

            this.selectedFilterOption.set(payload.filterOption);
            this.pushSelectedFilterOption$.next(ensureNotNullish(this.availableFilterOptions.find(item => item.id === payload.filterOption)));

            this.updateCompetitionChips();
          });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel() {
    this.modalService.onCancel();
  }

  getCompetitionName(name: string): string {
    return processTranslationPlaceholders(name, this.translationService);
  }

  getFilterOptions(): Observable<SelectOption[]> {
    return of(this.availableFilterOptions);
  }

  isCompetitionSelected(id: CompetitionId): boolean {
    return this.currentPayload().selectedCompetitionIds.includes(id);
  }

  onConfirm() {
    const option = this.selectedFilterOption();
    this.modalService.onConfirm({
      filterOption: option,
      selectedCompetitionIds: option === 'custom' ? this.selectedCompetitionIds() : [],
    } satisfies CompetitionFilterSuccessPayload);
  }

  onFilterOptionSelect(selectdOption: SelectOption) {
    this.selectedFilterOption.set(selectdOption.id as CompetitionFilterOption);
  }

  onValueChange(event: Event) {
    const inputValue = getHtmlInputElementFromEvent(event).value;
    console.log('input value is', inputValue)
  }

  onChipValueChanged(payload: CheckboxChipValueChanged) {
    const currentlySelected = [...this.selectedCompetitionIds()];
    const { checked } = payload;
    const competitionId = this.parseCompetitionChipId(payload.id);

    if (checked) {
      currentlySelected.push(competitionId);
    } else {
      const idx = currentlySelected.findIndex(id => competitionId === id);
      if (idx >= 0) {
        currentlySelected.splice(idx, 1);
      }
    }

    this.selectedCompetitionIds.set([...uniqueArrayElements(currentlySelected)]);

    this.updateCompetitionChips();
  }

  private updateCompetitionChips() {
    this.competitionChips.set(this.currentPayload().availableCompetitions.map(item => {
      return {
        id: this.buildCompetitionChipId(item.id),
        icon: item.iconSmall ? { type: 'competition', content: item.iconSmall } : undefined,
        displayText: processTranslationPlaceholders(item.shortName, this.translationService),
        checked: this.selectedCompetitionIds().includes(item.id),
      };
    }));
  }

  private buildCompetitionChipId(competitionId: CompetitionId): string {
    return [ModalCompetitionFilterComponent.COMPETITION_CHIP_ID_PREFIX, competitionId.toString()].join('');
  }

  private parseCompetitionChipId(id: string): CompetitionId {
    if (!id.startsWith(ModalCompetitionFilterComponent.COMPETITION_CHIP_ID_PREFIX)) {
      throw new Error(`Invalid competition chip ID`);
    }

    return Number(id.substring(ModalCompetitionFilterComponent.COMPETITION_CHIP_ID_PREFIX.length));
  }

}
