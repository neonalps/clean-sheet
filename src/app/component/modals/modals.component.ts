import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Modal, ModalService } from '@src/app/module/modal/service';
import { StatsModalComponent } from "@src/app/component/stats-modal/stats-modal.component";
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DeleteModalComponent } from '@src/app/component/delete-modal/delete-modal.component';
import { ModalSelectShirtComponent } from '@src/app/component/modal-select-shirt/modal-select-shirt.component';
import { ModalConfirmAddPersonComponent } from "@src/app/component/modal-confirm-add-person/modal-confirm-add-person.component";
import { ModalGameListFilterComponent } from "@src/app/component/modal-game-list-filter/modal-game-list-filter.component";

@Component({
  selector: 'app-modals',
  imports: [
    CommonModule,
    DeleteModalComponent,
    ModalSelectShirtComponent,
    StatsModalComponent,
    ModalConfirmAddPersonComponent,
    ModalGameListFilterComponent
  ],
  templateUrl: './modals.component.html'
})
export class ModalsComponent implements OnInit, OnDestroy {

  private readonly modalService = inject(ModalService);

  readonly isActive = signal(false);
  readonly modalType = computed<Modal | null>(() => this.modalService.modalType());

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.active$
      .pipe(takeUntil(this.destroy$))
      .subscribe(active => {
        this.isActive.set(active);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
