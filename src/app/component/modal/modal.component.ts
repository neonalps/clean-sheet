import { Component, inject } from '@angular/core';
import { ModalService } from '@src/app/module/modal/service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  containerClicked() {
    this.modalService.outsideClicked();
  }

}
