import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Modal, ModalService } from '@src/app/module/modal/service';
import { StatsModalComponent } from "@src/app/component/stats-modal/stats-modal.component";
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DeleteModalComponent } from '@src/app/component/delete-modal/delete-modal.component';
import { ModalSelectShirtComponent } from '../modal-select-shirt/modal-select-shirt.component';
import { ModalConfirmAddPersonComponent } from "../modal-confirm-add-person/modal-confirm-add-person.component";

@Component({
  selector: 'app-modals',
  imports: [CommonModule, DeleteModalComponent, ModalSelectShirtComponent, StatsModalComponent, ModalConfirmAddPersonComponent],
  templateUrl: './modals.component.html',
  styleUrl: './modals.component.css'
})
export class ModalsComponent implements OnInit, OnDestroy {

  isActive = signal(false);

  private readonly modalService = inject(ModalService);

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

  isConfigmAddPersonModalActive() {
    return this.modalService.modalType() === Modal.ConfirmAddPerson;
  }

  isDeleteModalActive() {
    return this.modalService.modalType() === Modal.Delete;
  }

  isShirtModalActive() {
    return this.modalService.modalType() === Modal.Shirt;
  }

  isStatsModalActive() {
    return this.modalService.modalType() === Modal.Stats;
  }

}
