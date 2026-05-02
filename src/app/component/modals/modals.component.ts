import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Modal, ModalService } from '@src/app/module/modal/service';
import { StatsModalComponent } from "@src/app/component/stats-modal/stats-modal.component";
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DeleteModalComponent } from '@src/app/component/delete-modal/delete-modal.component';
import { ModalSelectShirtComponent } from '@src/app/component/modal-select-shirt/modal-select-shirt.component';
import { ModalConfirmAddPersonComponent } from "@src/app/component/modal-confirm-add-person/modal-confirm-add-person.component";
import { ModalGameListFilterComponent } from "@src/app/component/modal-game-list-filter/modal-game-list-filter.component";
import { ModalCompetitionFilterComponent } from "@src/app/component/modal-competition-filter/modal-competition-filter.component";
import { ModalEditGameAbsencesComponent } from "@src/app/component/modal-edit-game-absences/modal-edit-game-absences.component";

@Component({
  selector: 'app-modals',
  imports: [CommonModule, DeleteModalComponent, ModalSelectShirtComponent, StatsModalComponent, ModalConfirmAddPersonComponent, ModalGameListFilterComponent, ModalCompetitionFilterComponent, ModalEditGameAbsencesComponent],
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

  isCompetitionFilterModalActive() {
    return this.modalService.modalType() === Modal.CompetitionFilter;
  }

  isConfirmAddPersonModalActive() {
    return this.modalService.modalType() === Modal.ConfirmAddPerson;
  }

  isDeleteModalActive() {
    return this.modalService.modalType() === Modal.Delete;
  }

  isEditGameAbsencesModalActive() {
    return this.modalService.modalType() === Modal.EditGameAbsences;
  }

  isFilterGameListModalActive() {
    return this.modalService.modalType() === Modal.FilterGameList;
  }

  isShirtModalActive() {
    return this.modalService.modalType() === Modal.Shirt;
  }

  isStatsModalActive() {
    return this.modalService.modalType() === Modal.Stats;
  }

}
