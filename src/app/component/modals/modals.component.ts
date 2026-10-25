import { Component, computed, inject } from '@angular/core';
import { Modal, ModalService } from '@src/app/module/modal/service';
import { StatsModalComponent } from "@src/app/component/stats-modal/stats-modal.component";
import { CommonModule } from '@angular/common';
import { DeleteModalComponent } from '@src/app/component/delete-modal/delete-modal.component';
import { ModalSelectShirtComponent } from '@src/app/component/modal-select-shirt/modal-select-shirt.component';
import { ModalConfirmAddPersonComponent } from "@src/app/component/modal-confirm-add-person/modal-confirm-add-person.component";
import { ModalGameListFilterComponent } from "@src/app/component/modal-game-list-filter/modal-game-list-filter.component";
import { ModalModifyPersonComponent } from '../modal-modify-person/modal-modify-person.component';

@Component({
  selector: 'app-modals',
  imports: [
    CommonModule,
    DeleteModalComponent,
    ModalSelectShirtComponent,
    StatsModalComponent,
    ModalConfirmAddPersonComponent,
    ModalGameListFilterComponent,
    ModalModifyPersonComponent
],
  templateUrl: './modals.component.html'
})
export class ModalsComponent {

  readonly modalService = inject(ModalService);

  readonly isActive = computed<boolean>(() => this.modalService.active());
  readonly modalType = computed<Modal | null>(() => this.modalService.modalType());

}
