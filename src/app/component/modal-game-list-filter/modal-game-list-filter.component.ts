import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CompetitionId } from '@src/app/util/domain-types';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';

export type FilterGameListModalPayload = {
  onlyCompetitionIds?: CompetitionId[];
  onlyHome?: boolean;
  onlyInternational?: boolean;
};

@Component({
  selector: 'app-modal-game-list-filter',
  imports: [ModalComponent, ButtonComponent, I18nPipe],
  templateUrl: './modal-game-list-filter.component.html',
  styleUrl: './modal-game-list-filter.component.css'
})
export class ModalGameListFilterComponent implements OnInit, OnDestroy {

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.filterGameListPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        // TODO implement
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel() {
    this.modalService.onCancel();
  }

  onConfirm() {
    this.modalService.onConfirm();
  }

}
