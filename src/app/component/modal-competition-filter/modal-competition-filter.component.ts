import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Competition } from '@src/app/model/competition';
import { ModalService } from '@src/app/module/modal/service';
import { CompetitionId } from '@src/app/util/domain-types';
import { Subject, takeUntil } from 'rxjs';
import { ModalComponent } from "@src/app/component/modal/modal.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getHtmlInputElementFromEvent, processTranslationPlaceholders } from '@src/app/util/common';

export type CompetitionFilterPayload = {
  availableCompetitions: Competition[];
  selectedCompetitionIds: CompetitionId[];
  onlyDomestic: boolean;
  onlyInternational: boolean;
}

export type CompetitionFilterSuccessPayload = Pick<CompetitionFilterPayload, 'selectedCompetitionIds' | 'onlyDomestic' | 'onlyInternational'>;

@Component({
  selector: 'app-modal-competition-filter',
  imports: [ButtonComponent, CommonModule, ModalComponent, I18nPipe, UiIconComponent],
  templateUrl: './modal-competition-filter.component.html',
})
export class ModalCompetitionFilterComponent implements OnInit, OnDestroy {

  private static EMPTY_PAYLOAD: CompetitionFilterPayload = {
    availableCompetitions: [],
    selectedCompetitionIds: [],
    onlyDomestic: false,
    onlyInternational: false,
  }

  readonly currentPayload = signal<CompetitionFilterPayload>(ModalCompetitionFilterComponent.EMPTY_PAYLOAD);

  private readonly modalService = inject(ModalService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.competitionFilterModalPayload$
          .pipe(takeUntil(this.destroy$))
          .subscribe(payload => {
            this.currentPayload.set(payload);
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

  isCompetitionSelected(id: CompetitionId): boolean {
    return this.currentPayload().selectedCompetitionIds.includes(id);
  }

  onConfirm() {
    this.modalService.onConfirm({
      selectedCompetitionIds: [],
      onlyDomestic: false,
      onlyInternational: false,
    } satisfies CompetitionFilterSuccessPayload);
  }

  onValueChange(event: Event) {
    const inputValue = getHtmlInputElementFromEvent(event).value;
    console.log('input value is', inputValue)
  }

}
